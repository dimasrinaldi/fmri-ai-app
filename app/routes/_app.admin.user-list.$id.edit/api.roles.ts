import { configServer } from "~/config/config.server";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiRoles = trpcProcedure
  .query(async ({ ctx: { authUser } }) => {
    const me = await authUser({ features: [] });
    const items = await db
      .selectFrom("role")
      .select([
        "id as value",
        "name as label",
      ])
      .where("id", "not in", [configServer.roleSystemId, configServer.roleGuestId])
      .orderBy("label", "asc")
      .execute();
    return { items };
  });
