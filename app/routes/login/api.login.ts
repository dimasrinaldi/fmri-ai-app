import { ZodError, z } from "zod";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";
import { hashPassword, parseStoredPassword } from "~/util/util.passwords";

export const apiLogin = trpcProcedure
  .use(({ next, ctx: { notifDisableFor } }) => {
    notifDisableFor(["validateInput"]);
    return next();
  })
  .input(
    z
      .object({
        username: z.string().refine(
          (arg) => arg.length > 0,
          { message: "Required" }
        ),
        password: z.string().refine(
          (arg) => arg.length > 0,
          { message: "Required" }
        ),
      })
  )
  .mutation(async ({ input, ctx: { setMyCookie, notifDisableFor } }) => {
    const user = await db
      .selectFrom("user")
      .select([
        "id",
        "password",
      ])
      .where("username", "=", input.username)
      .where("status", "=", "Active")
      .executeTakeFirst();

    let isOk = false;
    if (user) {
      const [passwordHash, passwordSalt] = parseStoredPassword(user.password);
      if (hashPassword(input.password, passwordSalt) == passwordHash) {
        await setMyCookie(user.id);
        isOk = true;
        notifDisableFor(["mutateOk"]);
      }
    }

    if (!isOk) {
      throw new ZodError([{
        message: "Incorrect username or password.",
        path: ["invalidLogin"],
        code: "custom",
      }]);
    }
  });
