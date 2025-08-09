import promiseAllProperties from "promise-all-properties";
import { db } from "~/db/db.app";
import { SchemaInputApiBase } from "~/schema";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiList = trpcProcedure
  .input(SchemaInputApiBase)
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const sqlMain = () => {
      const searchIn = ["title"] as const;
      const itemsFiltered = db
        .selectFrom("survey")
        .selectAll()
        .where((eb) => {
          const orSearch = searchIn.map((i) => eb(i, "ilike", `%${input.search.toLowerCase()}%`));
          return eb.or(orSearch);
        });

      return db.with("main", () => itemsFiltered).selectFrom("main");
    };

    const sqlItems = sqlMain()
      .select([
        "main.id",
        "main.title",
        "main.description",
        "main.createdAt",
        "main.respondentType"
      ])
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
