import dayjs from "dayjs";
import md5 from "md5";
import { ulid } from "ulidx";
import { ZodError, z } from "zod";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";
import { generateSalt, generateStoredPassword, hashPassword } from "~/util/util.passwords";
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
        username: z.string()
          .refine(
            (arg) => {
              return /^[a-z0-9.]+$/.test(arg) && arg.length > 4
            },
            { message: "Username must be at least 5 characters long and can only contain lowercase letters, numbers and dots" }
          ),
        clientId: z.string().refine(
          (arg) => arg.length > 0,
          { message: "Required" }
        ),
        roleId: z.string().refine(
          (arg) => arg.length > 0,
          { message: "Required" }
        ),
      })
  )
  .mutation(async ({ input, ctx: { authUser, notifDisableFor, notifOk } }) => {
    const me = await authUser({ features: [] });

    const existingUser = await db
      .selectFrom("user")
      .select("id")
      .where("username", "=", input.username)
      .executeTakeFirst();

    if (existingUser) {
      throw new ZodError([{
        message: "User with the same email already exists",
        path: ["username"],
        code: "custom",
      }]);
    }

    const password = md5(Math.random().toString());
    const passwordSalt = generateSalt();
    const passwordHash = hashPassword(password, passwordSalt);

    await db
      .insertInto("user")
      .values(utilPgSave({
        id: ulid(),
        name: input.name,
        username: input.username,
        password: generateStoredPassword(passwordHash, passwordSalt),
        clientId: input.clientId,
        roleId: input.roleId,
        updatedById: me.id,
        createdAt: dayjs().format(),
        updatedAt: dayjs().format(),
        status: "Active",
        createdById: me.id,
      }))
      .executeTakeFirstOrThrow();

    notifDisableFor(["mutateOk"]);
    return { password };
  });
