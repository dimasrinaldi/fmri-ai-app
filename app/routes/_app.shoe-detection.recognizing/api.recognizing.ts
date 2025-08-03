import { openai } from '@ai-sdk/openai';
import { generateObject } from "ai";
import dayjs from "dayjs";
import _ from 'lodash';
import moment from 'moment';
import { ulid } from "ulidx";
import { z } from "zod";
import { configServer } from "~/config/config.server";
import { getDataCatMinuteKmBySec } from '~/data/data.cat-minute-km';
import { dataRunningDistance, TRunningDistanceId } from '~/data/data.running-distance';
import { db } from "~/db/db.app";
import { DbNewShoeDetection } from "~/db/db.shoe-detection";
import { trpcProcedure } from "~/trpc/trpc.app";
import { utilCompressBase64ImageData } from '~/util/util.compress-base64-image-data';
import { utilFilePath } from '~/util/util.file-path';
import { utilMetaBase64Url } from "~/util/util.meta-base64-url";
import { utilMinIo } from '~/util/util.minio';
import { utilPgSave } from '~/util/util.pg-save';
import { utilTitleCase } from '~/util/util.title-case';

const distanceIds = dataRunningDistance.map((i) => i.id);
export const apiRecognizing = trpcProcedure
  .input(z.object({
    clientId: z.string(),
    base64Url: z.string(),
    fileName: z.string(),
    onDuplicate: z.enum(['skip', 'replace']).default('skip'),

    eventName: z.string().min(1, { message: "Required" }),
    distanceVars: z.array(z.object({
      id: z.custom<TRunningDistanceId>().refine(
        (i) => distanceIds.includes(i),
        { message: `Need one of these values ${distanceIds}` }
      ),
      color: z.string(),
      km: z.number().min(1),
      startedAt: z.string().refine(
        (i) => moment(i).isValid(),
        { message: `Invalid datetime format` }
      )
    })).min(1, { message: "Required" }),
  }))
  .mutation(async ({ input, ctx: { authUser } }) => {

    await authUser({ features: [] });

    const eventAt = getDtNoTz(input.distanceVars[0].startedAt).split(" ")[0];

    const meta = utilMetaBase64Url({
      base64Url: input.base64Url,
      fileName: input.fileName,
      tags: [input.clientId, eventAt]
    })

    if (input.onDuplicate == 'skip') {
      const data = await db.selectFrom("shoeDetection")
        .select(["id"])
        .where("imageName", "=", meta.fileName)
        .executeTakeFirst();
      if (data) {
        return { ok: true };
      }
    }

    let distanceVars = _.clone(input.distanceVars).map(i => {
      const drDistance = dataRunningDistance.find(j => j.id == i.id);

      let textArr: string[] = [i.id];
      if (drDistance) {
        textArr.push(drDistance.label);
      }
      textArr = _.uniq(textArr)

      const label = textArr[textArr.length - 1];
      return {
        ...i,
        label,
        color: i.color.toLowerCase().trim(),
        colorExt: `bg color ${i.color} with text ${textArr.join(" or ")}`.trim()
      }
    });

    const shoeDetectSql = db.selectFrom('shoeDetection')
      .select(["id", "brand", "model"])
      .where("model", "!=", "UNKNOWN")
      .orderBy('id', 'desc')
      .limit(10_000)
    const shoeDetectStats = db.selectFrom(shoeDetectSql.as('sd'))
      .select(eb => [
        eb.fn.count<number>('id').as('itemCounts'),
        eb.fn.max<string>('brand').as('brand'),
        "model",
      ]).groupBy('model')
    const dbModels = await db.selectFrom(shoeDetectStats.as("sds"))
      .selectAll()
      .where("itemCounts", ">=", 3)
      .orderBy('itemCounts desc')
      .limit(120)
      .execute()

    const models = _.uniq(dbModels.map(i => i.model).map(i => i.trim()));
    const brands = _.uniq(dbModels.map(i => i.brand).map(i => i.trim()));

    const limitPersonAnalyzed = 2;
    const getAnswerStats = async (model: "gpt" | "mini") => {
      return await generateObject({
        model: model == "mini" ? openai('gpt-4.1-mini') : openai('gpt-4.1'),
        // model: model == "gpt" ? openai('gpt-4.1-mini-2025-04-14') : google('gemini-2.0-flash'),
        // model: openai('gpt-4.1-mini'),
        // model: google('gemini-2.0-flash'),
        temperature: 0.3,
        schema: z.object({
          runners: z.array(
            z.object({
              gender: z.enum(["MALE", "FEMALE"]).default("FEMALE"),
              bib: z.object({
                bgColor: z.enum(distanceVars.map(i => i.color) as [string]).describe("Dominant color"),
                number: z.string()
              }),
              shoe: z.object({
                brand: z.enum(brands as [string]),
                model: z.enum(models as [string]),
                color: z.string().describe("One dominant simple color. example : RED, BLUE, YELLOW")
              })
            })
          ),
          isPodium: z.boolean().default(false),
          date: z.object({
            day: z.string().describe('day with format DD'),
            month: z.string().describe('month with format MM'),
            year: z.string().describe("year with format : YYYY"),
          }).describe("picture date stamp with format Day/Month/Year"),
          time: z.string().describe("picture time with format HH:mm:ss")
        }),
        system: `
        You are a specialized AI assistant focused on analyzing runners and their equipment in race photographs. Your task is to:

        1. Runner Analysis (Up to ${limitPersonAnalyzed} people):
           - Identify and extract participant numbers (BIB) worn on runners' clothing
           - If BIB number is not clearly visible, mark as "UNKNOWN"
           - Assess runner's gender (MALE/FEMALE)
           - Identify BIB Profile: Analyze and record the color and text details visible on the runner's bib number
        
        2. Shoe Brand Analysis:
           - Identify running shoe brands through visual inspection
           - Check for brand identifiers from multiple angles:
             * Front view of the shoe
             * Side views (both inner and outer)
             * Back view
             * Top view when visible
           - Focus on clear visual identification elements
           - Look for distinctive design patterns and markings
           - If brand is not clearly visible, prioritize accuracy over guessing
           - Must not be UNKNOWN

        3. Shoe Model Analysis:
           - Identify specific shoe model characteristics and unique features
           - Look for model-specific design elements (sole pattern, upper design)
           - Consider recent and popular running shoe model lines
           - Match visible features with known model specifications
           - Note any special edition or limited release indicators
           - Cross-reference visible features with brand's current product lineup
           - If model is not clearly visible, prioritize accuracy over guessing
           - Must not be UNKNOWN

        4. Environmental Context:
           - Check if the photo shows a podium/award ceremony setting
           - Scan the image for any visible timestamp information located in the bottom left of the photo
           - Consider race context and competitive setting

        5. Priority Guidelines:
           - Focus on runners with clearly visible gear and identification
           - Ensure accurate color identification for BIB tags
           - Maintain consistent and structured data reporting
           - Provide exactly one brand and model name per runner
           - Sort based on confidence level of brand and model identification

        Analyze systematically and provide structured data matching the required schema for each detected runner.
        Sort the results prioritizing participants from the center of the photo.
      `,
        messages: [
          {
            role: 'user',
            content: `detect objects in the following base64 image`,
            experimental_attachments: [
              {
                url: input.base64Url,
                contentType: meta.mimeType,
              },
            ],
          },
        ],
      })
    }

    const answerStat = await getAnswerStats("mini").catch(async e => {
      return await getAnswerStats("gpt");
    });

    const persons = answerStat.object.runners.slice(0, limitPersonAnalyzed);

    const { isPodium, date: dt, time } = answerStat.object;
    const dateTimeStamp = `${dt.year}-${dt.month}-${dt.day}T${time}Z`

    const dbData: DbNewShoeDetection[] = persons.map((i) => {
      const distanceVar = distanceVars.find(j => j.color == i.bib.bgColor) ?? distanceVars[0];

      const startedAt = getDtNoTz(distanceVar.startedAt)
      const finishedAt = dayjs(dateTimeStamp).isValid() ? getDtNoTz(dateTimeStamp) : null;
      // console.log(dateTimeStamp, finishedAt, dayjs(dateTimeStamp).isValid(), moment(dateTimeStamp).isValid(), "sdhjfjdf0");

      const finishedSec = finishedAt && startedAt ?
        dayjs(finishedAt).diff(dayjs(startedAt), 'second') : 0;
      const distanceNum = distanceVar.km ?? 0
      const speedSecKm = distanceNum > 0 ? _.round(finishedSec / distanceNum) : 0;
      const minuteKm = getDataCatMinuteKmBySec(speedSecKm).label;
      // console.log("dateTimeStampImage", dateTimeStamp, "distancevarStartedAt", distanceVar.startedAt, "finishedAt", finishedAt, "startedAt", startedAt)
      // console.log("minuteKm", minuteKm, "speedSecKm", speedSecKm, "distanceNum", distanceNum,
      //   "finishedSec", finishedSec)
      return {
        brand: upperTrim(i.shoe.brand),
        model: upperTrim(i.shoe.model),
        color: upperTrim(i.shoe.color),
        gender: upperTrim(i.gender),
        createdAt: dayjs().format(),
        createdById: configServer.systemId,
        updatedAt: dayjs().format(),
        updatedById: configServer.systemId,
        imageName: meta.fileName,
        id: ulid(),
        clientId: input.clientId,
        event: upperTrim(input.eventName),
        startedAt: distanceVar.startedAt,
        distance: distanceVar.id,
        distanceNum,
        finishedAt,
        minuteKm: minuteKm.toUpperCase(),
        podium: isPodium ? "YES" : "NO",
        dataStatus: "ORIGINAL",
        runningNum: upperTrim(i.bib.number),
        eventAt
      }
    })
    // console.log(distanceVars, persons, dbData);

    if (dbData.length > 0) {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom('shoeDetection')
          .where("imageName", "=", meta.fileName)
          .where("clientId", "=", input.clientId)
          .execute();
        await trx.insertInto('shoeDetection')
          .values(utilPgSave(dbData))
          .execute();
        const compressed64Data = await utilCompressBase64ImageData(meta.base64Data, 2000);
        const buffer = Buffer.from(compressed64Data, 'base64');
        await utilMinIo((i) =>
          i.client.putObject(
            i.bucket, utilFilePath("shoe-detection", meta.fileName),
            buffer
          )
        );
      })
    }

    return { ok: true };
  });

const upperTrim = (str: string) => {
  return utilTitleCase(str).trim().toUpperCase().replace(/[^a-zA-Z0-9]/g, ' ');
}

const getDtNoTz = (dtStrIso: string) => {
  if (!dtStrIso.includes("T")) return dtStrIso;
  const datePart = dtStrIso.split("T")[0];
  const timePart = dtStrIso.split("T")[1].split("+")[0].split("Z")[0]; // atau .split("Z")[0] untuk UTC
  const formatted = `${datePart} ${timePart}`;
  return formatted;
}