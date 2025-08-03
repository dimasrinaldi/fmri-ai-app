import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import md5 from "md5";
import { z } from "zod";
import { configServer } from "~/config/config.server";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";
import { generateSalt, generateStoredPassword, hashPassword } from "~/util/util.passwords";

export const apiResetPassword = trpcProcedure
  .input(
    z
      .object({ id: z.string() })
  )
  .mutation(async ({ input, ctx: { authUser, notifDisableFor } }) => {
    const me = await authUser({ features: [] });

    const user = await db
      .selectFrom("user")
      .select([
        "id",
        "clientId",
        "roleId",
      ])
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();

    if (input.id == me.id) {
      throw new TRPCError({
        message: "Cannot mutate self",
        code: "BAD_REQUEST",
      });
    }

    if (input.id == configServer.systemId) {
      throw new TRPCError({
        message: "User not found",
        code: "BAD_REQUEST",
      });
    }

    const password = md5(Math.random().toString());
    const passwordSalt = generateSalt();
    const passwordHash = hashPassword(password, passwordSalt);

    await db
      .updateTable("user")
      .set({
        password: generateStoredPassword(passwordHash, passwordSalt),
        updatedAt: dayjs().format(),
        updatedById: me.id,
      })
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();

    notifDisableFor(["mutateOk"]);
    return { password };
  });
