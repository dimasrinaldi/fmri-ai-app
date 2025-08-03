import promiseAllProperties from "promise-all-properties";
import { z } from "zod";
import { configServer } from "~/config/config.server";
import { TItemStatusId } from "~/data/data.item-status";
import { db } from "~/db/db.app";
import { SchemaInputApiBase } from "~/schema";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiList = trpcProcedure
  .input(SchemaInputApiBase.extend({
    status: z.custom<TItemStatusId>()
  }))
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const sqlMain = () => {
      const searchIn = ["name"] as const;
      const itemsFiltered = db
        .selectFrom("user")
        .selectAll()
        .where((eb) => {
          const orSearch = searchIn.map((i) => eb(i, "ilike", `%${input.search.toLowerCase()}%`));
          return eb.or(orSearch);
        })
        .where("id", "not in", [configServer.guestId, configServer.systemId])
        .where("status", "=", input.status);

      return db.with("main", () => itemsFiltered).selectFrom("main");
    };

    const sqlItems = sqlMain()
      .leftJoin("client", "client.id", "main.clientId")
      .leftJoin("role", "role.id", "main.roleId")
      .leftJoin("user", "user.id", "main.updatedById")
      .select([
        "main.id",
        "main.username",
        "main.name",
        "main.status",
        "main.updatedAt",
        "user.name as updatedBy",
        "client.name as clientName",
        "role.name as roleName",
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
