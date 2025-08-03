import promiseAllProperties from "promise-all-properties";
import { z } from "zod";
import { db } from "~/db/db.app";
import { SchemaInputApiBase } from "~/schema";
import { trpcProcedure } from "~/trpc/trpc.app";
import { utilFilePathUrl } from "~/util/util.file-path-url";
import { dataColSearch } from "../_app.shoe-detection._filter.data/data.col.search";

export const apiList = trpcProcedure
  .input(SchemaInputApiBase.extend({
    clientId: z.string(),
  })).query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const sqlMain = () => {
      const searchIn = dataColSearch.map((i) => i.id);
      const itemsFiltered = db
        .selectFrom("shoeDetection")
        .select(({ fn }) => ["imageName", fn.max<string>("createdAt").as("createdAt")])
        .where("clientId", "=", input.clientId)
        .where((eb) => {
          const orSearch = searchIn.map((i) => eb(i, "ilike", `%${input.search.toLowerCase()}%`));
          return eb.or(orSearch);
        })
        .groupBy("imageName")
      return db.with("main", () => itemsFiltered).selectFrom("main");
    };

    const sqlItems = sqlMain()
      .selectAll()
      .orderBy(input.sortBy as any, input.sortDirection)
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

    const recItems = await db.selectFrom("shoeDetection")
      .selectAll()
      .where("imageName", "=", result.items[0]?.imageName ?? "dfjhfue7")
      .execute();
    return {
      items: result.items.map(i => ({ ...i, imageUrl: utilFilePathUrl("shoe-detection", i.imageName) })),
      count: result.count?.count ?? 0,
      recItems
    };
  });
