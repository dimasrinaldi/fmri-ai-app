import { z } from "zod";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiClients = trpcProcedure
  .input(
    z
      .object({ includeIds: z.array(z.string()).default([]) })
  )
  .query(async ({ input, ctx: { authUser } }) => {
    const me = await authUser({ features: [] });
    const items = await db
      .selectFrom("client")
      .select([
        "id as value",
        "name as label",
      ])
      .execute();
    return { items };
  });
