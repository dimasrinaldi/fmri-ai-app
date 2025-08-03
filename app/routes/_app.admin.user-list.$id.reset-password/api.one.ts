import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { configServer } from "~/config/config.server";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiOne = trpcProcedure
  .input(
    z
      .object({ id: z.string() })
  )
  .query(async ({ input, ctx: { authUser } }) => {
    const me = await authUser({ features: [] });


    const item = await db
      .selectFrom("user")
      .select([
        "name",
        "username",
      ])
      .where("id", "=", input.id)
      .where("id", "!=", configServer.systemId)
      .executeTakeFirst();

    if (!item) {
      throw new TRPCError({
        message: "User not found",
        code: "BAD_REQUEST",
      });
    }

    return { item };
  });
