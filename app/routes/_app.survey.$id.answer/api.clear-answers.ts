import { z } from "zod";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";

export const clearAnswer = trpcProcedure
  .input(z.object({
    surveyId: z.string(),
  })).mutation(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });
    await db.transaction().execute(async (trx) => {
      await trx.deleteFrom("surveyData")
        .where("surveyId", "=", input.surveyId)
        .execute();
      await trx.updateTable("respondent")
        .set({ answer: "" })
        .where("surveyId", "=", input.surveyId)
        .execute();
    });

  });
