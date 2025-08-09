import promiseAllProperties from "promise-all-properties";
import { z } from "zod";
import { db } from "~/db/db.app";
import { DbRespondent } from "~/db/db.respondent";
import { SchemaInputApiBase } from "~/schema";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiList = trpcProcedure
  .input(SchemaInputApiBase.extend({
    surveyId: z.string(),
  })).query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const sqlMain = () => {
      const itemsFiltered = db
        .selectFrom("respondent")
        .selectAll()
        .where("surveyId", "=", input.surveyId)
      return db.with("main", () => itemsFiltered).selectFrom("main");
    };

    const sqlMainFilter = () => {
      const searchIn: (keyof DbRespondent)[] = ["gender", "city", "maritalStatus", "occupation", "answer"];
      const itemsFiltered = sqlMain()
        .selectAll()
        .where((eb) => {
          const orSearch = searchIn.map((i) => eb(i, "ilike", `%${input.search.toLowerCase()}%`));
          return eb.or(orSearch);
        })
        .where("answer", "<>", "");
      return db.with("mainFilter", () => itemsFiltered).selectFrom("mainFilter");
    };

    const sqlCountAll = sqlMain()
      .select(({ fn }) => [fn.countAll<number>().as("count")])
      .executeTakeFirst();

    const sqlItems = sqlMainFilter()
      .selectAll()
      .orderBy(input.sortBy as any, input.sortDirection)
      .orderBy("id", "desc")
      .limit(input.limit)
      .offset(input.offset)
      .execute();

    const sqlCount = sqlMainFilter()
      .select(({ fn }) => [fn.countAll<number>().as("count")])
      .executeTakeFirst();

    const result = await promiseAllProperties({
      items: sqlItems,
      count: sqlCount,
      countTotal: sqlCountAll,
    });

    const surveyData = await db.selectFrom("surveyData")
      .selectAll()
      .where("respondentId", "in",
        result.items.length > 0 ? result.items.map((i) => i.id) : ["ndjye7946"]
      )
      .execute();

    return {
      items: result.items,
      count: result.count?.count ?? 0,
      countTotal: result.countTotal?.count ?? 0,
      surveyData
    };
  });
