import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import * as ulidx from "ulidx";
import { z, ZodError } from "zod";
import { configServer } from "~/config/config.server";
import { TItemStatusId } from "~/data/data.item-status";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";
import { utilPgSave } from "~/util/util.pg-save";

export const apiEdit = trpcProcedure
  .use(({ next, ctx: { notifDisableFor } }) => {
    notifDisableFor(["validateInput"]);
    return next();
  })
  .input(
    z
      .object({
        id: z.string().refine(
          (arg) => ulidx.isValid(arg),
          { message: "Invalid id" }
        ),
        name: z.string().refine(
          (arg) => arg.length > 0,
          { message: "Required" }
        ),
        clientId: z.string().refine(
          (arg) => arg.length > 0,
          { message: "Required" }
        ),
        roleId: z.string().refine(
          (arg) => arg.length > 0,
          { message: "Required" }
        ),
        status: z.custom<TItemStatusId>(),
      })
  )
  .mutation(async ({ input, ctx: { authUser, notifOk } }) => {
    const me = await authUser({ features: [] });

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



    await db
      .updateTable("user")
      .set(utilPgSave({
        ...input,
        updatedAt: dayjs().format(),
        updatedById: me.id,
      }))
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();

    notifOk("Successfully edited");
  });
