import promiseAllProperties from "promise-all-properties";
import { db } from "~/db/db.app";
import { SchemaInputApiBase } from "~/schema";
import { trpcProcedure } from "~/trpc/trpc.app";
import { dataColSearch } from "./data.col.search";
import { z } from "zod";

export const apiList = trpcProcedure
  .input(SchemaInputApiBase.extend({
    surveyId: z.string(),
  }))
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const sqlMain = () => {
      const searchIn = dataColSearch.map((i) => i.id);
      const itemsFiltered = db
        .selectFrom("surveyData")
        .selectAll()
        .where((eb) => {
          const orSearch = searchIn.map((i) => eb(i, "ilike", `%${input.search.toLowerCase()}%`));
          return eb.or(orSearch);
        })
        .where("surveyId", "=", input.surveyId);

      return db.with("main", () => itemsFiltered).selectFrom("main");
    };

    const sqlItems = sqlMain()
      .selectAll()
      .orderBy(input.sortBy as any, input.sortDirection)
      .orderBy("id", "desc")
      .limit(input.limit)
      .offset(input.offset)
      .execute();

    const sqlCount = sqlMain()
      .select(({ fn }) => [fn.countAll<number>().as("count")])
      .executeTakeFirst();

    const result = await promiseAllProperties({
      items: sqlItems,
      count: sqlCount,
    });

    return {
      items: result.items,
      count: result.count?.count ?? 0,
    };
  });
