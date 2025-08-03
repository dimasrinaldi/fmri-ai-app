import dayjs from "dayjs";
import { ZodError, z } from "zod";
import { TAppId } from "~/data/data.app";
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
        id: z.string(),
        name: z.string().refine(
          (arg) => arg.length > 0,
          { message: "Required" }
        ),
        apps: z.array(z.custom<TAppId>()),
        status: z.custom<TItemStatusId>(),
      })
  )
  .mutation(async ({ input, ctx: { authUser, notifOk } }) => {
    const me = await authUser({ features: [] });

    const existingClient = await db
      .selectFrom("client")
      .select("id")
      .where("id", "!=", input.id)
      .where("name", "=", input.name)
      .executeTakeFirst();

    if (existingClient) {
      throw new ZodError([{
        message: "Client with the same name already exists",
        path: ["name"],
        code: "custom",
      }]);
    }

    await db
      .updateTable("client")
      .set(utilPgSave({
        ...input,
        updatedAt: dayjs().format(),
        updatedById: me.id,
      }))
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();

    notifOk("Successfully edited");
  });
