import promiseAllProperties from "promise-all-properties";
import { configServer } from "~/config/config.server";
import { db } from "~/db/db.app";
import { SchemaInputApiBase } from "~/schema";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiList = trpcProcedure
  .input(SchemaInputApiBase)
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const sqlMain = () => {
      const searchIn = ["name"] as const;
      const itemsFiltered = db
        .selectFrom("role")
        .selectAll()
        .where((eb) => {
          const orSearch = searchIn.map((i) => eb(i, "ilike", `%${input.search.toLowerCase()}%`));
          return eb.or(orSearch);
        })
        .where("id", "not in", [configServer.roleGuestId, configServer.roleSystemId]);

      return db.with("main", () => itemsFiltered).selectFrom("main");
    };

    const sqlItems = sqlMain()
      .leftJoin("user", "user.id", "main.updatedById")
      .select([
        "main.id",
        "main.name",
        "main.acl",
        "main.updatedAt",
        "user.name as updatedBy",
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
