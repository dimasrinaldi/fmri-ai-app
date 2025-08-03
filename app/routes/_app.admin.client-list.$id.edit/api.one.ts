import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiOne = trpcProcedure
  .input(
    z
      .object({ id: z.string() })
  )
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const item = await db
      .selectFrom("client")
      .select([
        "name",
        "status",
        "apps",
      ])
      .where("id", "=", input.id)
      .executeTakeFirst();

    if (!item) {
      throw new TRPCError({
        message: "Client not found",
        code: "BAD_REQUEST",
      });
    }

    return { item };
  });
