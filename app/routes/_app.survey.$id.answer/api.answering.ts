import { openai } from "@ai-sdk/openai";
import { TRPCError } from "@trpc/server";
import { generateObject, generateText } from "ai";
import promiseAllProperties from "promise-all-properties";
import { z } from "zod";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";
import { deepseek } from '@ai-sdk/deepseek';
import dayjs from "dayjs";
import { DbSurveyData } from "~/db/db.survey-data";
import _ from "lodash";
import { google } from "@ai-sdk/google";

export const answering = trpcProcedure
  .input(z.object({
    surveyId: z.string(),
  })).mutation(async ({ input, ctx: { authUser, notifOk } }) => {
    await authUser({ features: [] });

    const survey = await db.selectFrom("survey")
      .select(["questionnaire", "respondentType", "toStatsNote"])
      .where("id", "=", input.surveyId)
      .executeTakeFirst();
    if (!survey) {
      throw new TRPCError({
        message: "Survey not found",
        code: "NOT_FOUND"
      })
    }
    if (survey?.respondentType == "Real") {
      throw new TRPCError({
        message: "This survey is configured for real respondents and cannot be processed using AI",
        code: "BAD_REQUEST"
      })
    }
    const concurrency = 5;

    const sqlMain = () => {
      const itemsFiltered = db
        .selectFrom("respondent")
        .selectAll()
        .where("surveyId", "=", input.surveyId)
      return db.with("main", () => itemsFiltered).selectFrom("main");
    }
    // get respondent to be answered
    const unanswerdRespondentSql = sqlMain()
      .select(["id", "age", "city", "gender", "occupation", "main.maritalStatus", "sec"])
      .where("answer", "=", "")
      .limit(concurrency)
      .execute();

    const totalCount = sqlMain()
      .select((eb) => eb.fn.countAll().as("count"))
      .executeTakeFirst();

    const data = await promiseAllProperties({
      unanswerdRespondent: unanswerdRespondentSql,
      totalCount: totalCount,
    });

    let result = {
      totalCount: data.totalCount?.count ?? 0,
      isEnd: data.unanswerdRespondent.length == 0,
    }
    if (result.isEnd) {
      return result;
    }

    await Promise.all(data.unanswerdRespondent.map(async (respondent) => {

      const aiRef = await promiseAllProperties({
        answer: generateText({
          model: deepseek('deepseek-chat'),
          temperature: 0.5,
          system: `You are a survey respondent with the following demographic profile: ${JSON.stringify(respondent)}\n. 
            Please provide authentic and realistic responses based on this demographic background.\n
            Note: \n
            - sec column means Social Economic.\n
            - sec_a is higher than sec_b, sec_b is higher than sec_c, and so on.`,
          prompt: `answer this questionaire ${survey.questionnaire}`,
        }),
        extract: generateObject({
          model: openai('gpt-4o-mini'),
          schema: z.object({
            questions: z.array(z.string()).describe("the questions data in text"),
            answers: z.array(z.string()).describe("the answers data in text"),
            categories: z.array(z.string()).describe("the categories data in text"),
          }),
          system: `You are very expert extractor`,
          prompt: `Extract questions, answers, and categories from the following text: \n\n${survey.toStatsNote}`,
        })
      })

      const { object } = await generateObject({
        model: deepseek("deepseek-chat"),
        temperature: 0,
        schema: z.object({
          surveyTitle: z.string().describe("the title of the survey. Max 3 words. Lowercase"),
          personName: z.string().describe("random name of the respondent. Max 2 words. Lowercase"),
          answers: z.array(z.object({
            question: z.string().describe(`
              question summary. Maximum 3 words. In English. \n
              ${aiRef.extract.object.questions.length > 0 ? `Use one of the following choices: : ${aiRef.extract.object.questions.join(", ")}.` : ""}.\n
              Can contain code as substring such as A1, B2, D3, Y4, etc.\n 
              Format example: A1. overall liking, Y3. purchase intention, X6. concept relevancy.
            `),
            age: z.enum(["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]).describe("the age of the respondent"),
            answers: z.array(z.object({
              answer: z.string().describe(`
                the answer of the question. Maximum 3 words. 
                Lowercase. Can contain number. In English.
                ${aiRef.extract.object.answers.length > 0 ? `For close-ended question, use one of the following answer choices: ${aiRef.extract.object.answers.join(", ")}.` : ""}
              `), //Must be in word form
              awarness: z.enum(["tom", "spont", "aided"]).describe(`the awareness of the answer. 
                AIDED: closed-ended question answer.
                TOM: top of mind (first answer from open question), 
                SPONT: spontaneous (NOT the first answer from open question).
              `),
              category: z.string().describe(`
                the category of the answer. Lowercase. Singular. In English.
                ${aiRef.extract.object.categories.length > 0 ? `use one of the following choices: ${aiRef.extract.object.categories.join(", ")}.` : ""}
              `),
              score: z.number().describe("Score from the answer if the question instructs to provide a range of answer values").default(0),
            })).describe(`the answers of the question`)
          })).describe("the answer of the questionaire"),
        }),
        system: `You are a data survey specialist.`,
        prompt: `Convert bellow answer to json object.\n\n---------\n\n ${aiRef.answer.text}`,
      });

      let surveyDatas: DbSurveyData[] = [];
      object.answers.forEach((question) => {
        question.answers.forEach((answer) => {
          surveyDatas.push({
            id: _.random(100000, 999999),
            surveyId: input.surveyId,
            surveyTitle: object.surveyTitle,
            personName: respondent.id, // object.personName,
            personAge: question.age,
            personCity: respondent.city,
            personGender: respondent.gender,
            question: question.question,
            answerContent: answer.answer,
            answerCategory: answer.category,
            answerSec: respondent.sec,
            awareness: answer.awarness as any,
            respondentId: respondent.id,
            answerScore: answer.score
          })
        })
      })

      await db.transaction().execute(async (trx) => {
        await trx.updateTable("respondent")
          .set({ answer: aiRef.answer.text, updatedAt: dayjs().format() })
          .where("id", "=", respondent.id)
          .execute();

        await trx.deleteFrom("surveyData")
          .where("respondentId", "=", respondent.id)
          .execute();

        await trx.insertInto("surveyData")
          .values(surveyDatas)
          .execute();
      })

      notifOk(`${data.unanswerdRespondent.length} AI respondents answered`);
    }));

    return result;
  });

//   based on the questionnaire above, extract the following values:
// questions : {All distinct question choices available in the questionnaire. Maximum 3 words. Do not include codes like Y0, Y1, Y2, etc. Lowercase. In English, pisahkan dengan koma}
// answers : All distinct answer choices available in the questionnaire. Maximum 3 words. Lowercase. Must be in word form. In English. pisahkan dengan koma

