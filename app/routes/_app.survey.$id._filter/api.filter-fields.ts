import { z } from "zod";
import { db } from "~/db/db.app";
import { DbSurveyDataTable } from "~/db/db.survey-data";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiFilterFields = trpcProcedure
  .input(z.object({
    col: z.string(),
  }))
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });
    const col = input.col as keyof DbSurveyDataTable
    const items = await db.selectFrom("surveyData").select(`${col} as name`)
      .groupBy(col)
      .orderBy(col, "desc")
      .execute();
    return { items: items.map(i => ({ name: i.name?.toString() ?? "" })) };
  });
