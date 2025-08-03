import moment from "moment";
import { ulid } from "ulidx";
import { ZodError, z } from "zod";
import { TAppId } from "~/data/data.app";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";
import { utilPgSave } from "~/util/util.pg-save";

export const apiCreate = trpcProcedure
  .use(({ next, ctx: { notifDisableFor } }) => {
    notifDisableFor(["validateInput"]);
    return next();
  })
  .input(
    z
      .object({
        name: z.string().refine(
          (arg) => arg.length > 0,
          { message: "Required" }
        ),
        apps: z.array(z.custom<TAppId>())
      })
  )
  .mutation(async ({ input, ctx: { authUser, notifOk } }) => {
    const me = await authUser({ features: [] });

    const existingClient = await db
      .selectFrom("client")
      .select("id")
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
      .insertInto("client")
      .values(utilPgSave({
        id: ulid(),
        ...input,
        apps: [],
        status: "Active",
        createdAt: moment().format(),
        createdById: me.id,
        updatedAt: moment().format(),
        updatedById: me.id,
      }))
      .executeTakeFirstOrThrow();

    notifOk("Successfully added");
  });
