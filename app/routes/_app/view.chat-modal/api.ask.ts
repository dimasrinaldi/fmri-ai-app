import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { z } from "zod";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiAsk = trpcProcedure
  .input(
    z.object({
      messages: z.array(z.custom<CoreMessage>()),
      systemPrompt: z.string()
    })
  )
  .mutation(async ({ input, ctx: { authUser, notifDisableFor } }) => {
    await authUser({ features: [] });
    notifDisableFor(["mutateOk"]);

    const system = input.systemPrompt
    let isAnswerError = false;
    let answer = "";
    let reffData: string[] = []
    const answerStats = await generateText({
      model: openai('gpt-4o-mini'),
      system,
      messages: input.messages,
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
      survey_data (
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


