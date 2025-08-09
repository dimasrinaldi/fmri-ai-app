import { openai } from "@ai-sdk/openai";
import { TRPCError } from "@trpc/server";
import { CoreMessage, generateText, tool } from "ai";
import { z } from "zod";
import { dbKnex } from "~/db/db.knex";
import { trpcProcedure } from "~/trpc/trpc.app";


export const apiAsk = trpcProcedure
  .input(
    z.object({
      surveyId: z.string(),
      messages: z.array(z.custom<CoreMessage>()),
    })
  )
  .mutation(async ({ input, ctx: { authUser, notifDisableFor } }) => {
    await authUser({ features: [] });
    notifDisableFor(["mutateOk"]);

    let isAnswerError = false;
    let answer = "";
    let reffData: string[] = []
    const answerStats = await generateText({
      model: openai('gpt-4o-mini'),
      system: `Anda adalah assistant AHLI Survey Data Statistics.
        Daftar Istilah : 
        BUMO : brand used most often.
      `,
      messages: input.messages,
      maxSteps: 3,
      tools: {
        getDataFromDb: tool({
          description: "Ambil data dari posgresql",
          parameters: z.object({
            query: z.string().describe(`Query POSTGRESQL.${getSystemPrompt()}  `),
          }),
          execute: async ({ query }) => {
            reffData.push(query)
            if (!query.toLowerCase().includes("select")) {
              throw new TRPCError({
                message: "Currently, the supported database queries are limited to data retrieval commands only",
                code: "BAD_REQUEST"
              })
            }
            const sqlRawQuery = dbKnex
              .with("survey_data_response", (db) => db.select("*").from("survey_data").where("survey_id", input.surveyId))
              .with("main", dbKnex.raw(query))
              .select("*").from("main").toString()
              .replace(";", "");

            const countResultDb: { rows: any[] } = await dbKnex.raw(`select count(*) from (${sqlRawQuery}) as s;`);
            const countResult = countResultDb.rows?.[0]?.count ?? 0;
            reffData.push(`${countResult} count rows`)
            if (countResult >= 1_000) {
              throw new TRPCError({
                message: "Exceeded data reference limit",
                code: "BAD_REQUEST"
              })
            }
            const resultRows = await dbKnex.raw(sqlRawQuery);
            const data = resultRows.rows ?? [];
            return { data }
          },
        }),
      },
    }).catch(e => {
      isAnswerError = true;
      reffData.push(e.message)
      return { text: e.message }
    });
    answer = answerStats.text;
    const stringConverter = await generateText({
      model: openai('gpt-4o-mini'),
      system: `Ubah Markdown dalam text menjadi HTML.
              ${isAnswerError && `Berikan permohonan maaf di awal kalimat karena ada error. 
                Suruh coba dengan pertanyaan lain yang lebih spesifik.
                Ubah menjadi human readable.`} 
              Jangan ada header seperti h1, h2, dsb.
              Jangan ada tag <title>, <head>, <body> dan <html>.`,
      prompt: answer,
    });
    answer = stringConverter.text;

    return { answer, reffData, isAnswerError };
  });

const getSystemPrompt = () => {

  const sytemPrompt = `TABEL SCHEMA:
      survey_data_response (
        survey_title text,
        person_name text,
        person_age text,
        person_city text, // enum : male | female
        person_gender text,
        question text,
        answer_content text,
        answer_category text, // brand dari jawaban
        answer_sec text,
        awareness text, // enum : tom (top of mind) | spont (spontaneous) | aided
      );
      ---------------------------------
      Tidak ada fungsi jsonb_array_elements_text jadi untuk mengambil data dari jsonb gunakan jsonb_each_text.
      Ubah semua filter pencarian, dan value dari field yang dicarinya menjadi huruf kecil menggunakan fungsi LOWER().
      HANYA kueri pengambilan yang diperbolehkan.
      HARUS hitung statistik berdasarkan uniq orang.`

  // const sytemPrompt = `TABEL SCHEMA:
  // survey_data (
  //   id int4 NOT NULL DEFAULT nextval('answer_id_seq'::regclass),
  //   survey_title text,
  //   person_name text,
  //   person_age text,
  //   person_city text, // enum : male | female
  //   person_gender text,
  //   question text,
  //   answer_content text,
  //   answer_category text, // brand dari jawaban
  //   answer_sec text,
  //   awareness text, // enum : tom (top of mind) | spont (spontaneous) | aided
  //   PRIMARY KEY (id)
  // );
  // ---------------------------------
  // Tidak ada fungsi jsonb_array_elements_text jadi untuk mengambil data dari jsonb gunakan jsonb_each_text.
  // Ubah semua filter pencarian, dan value dari field yang dicarinya menjadi huruf kecil menggunakan fungsi LOWER().
  // HANYA kueri pengambilan yang diperbolehkan.
  // HARUS hitung statistik berdasarkan uniq orang.`

  return sytemPrompt;
}


