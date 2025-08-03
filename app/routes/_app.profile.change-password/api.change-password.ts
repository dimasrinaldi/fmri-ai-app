import dayjs from "dayjs";
import validator from "validator";
import { ZodError, z } from "zod";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";
import { generateSalt, generateStoredPassword, hashPassword, parseStoredPassword } from "~/util/util.passwords";

export const apiChangePassword = trpcProcedure
  .use(({ next, ctx: { notifDisableFor } }) => {
    notifDisableFor(["validateInput"]);
    return next();
  })
  .input(
    z
      .object({
        old_password: z.string().refine(
          (arg) => arg.length > 0,
          { message: "Please enter your current password" }
        ),
        new_password: z.string()
          .refine(
            (arg) => arg.length > 0,
            { message: "Required" }
          )
          .refine(
            (arg) => validator.isStrongPassword(arg, SchemaPasswordRequirements),
            { message: "Min. 8 characters in length containing lower and upper case characters, numbers and symbols" }
          ),
        password_confirmation: z.string().refine(
          (arg) => arg.length > 0,
          { message: "Required" }
        ),
      })
      .refine(
        (data) => data.new_password == data.password_confirmation,
        {
          message: "Passwords do not match",
          path: ["password_confirmation"],
        }
      )
  )
  .mutation(async ({ input, ctx: { authUser, notifOk } }) => {
    const me = await authUser({ features: [] });

    const currentPassword = await db
      .selectFrom("user")
      .select(["password"])
      .where("id", "=", me.id)
      .executeTakeFirstOrThrow();

    const [passwordHash, passwordSalt] = parseStoredPassword(currentPassword.password);

    if (hashPassword(input.old_password, passwordSalt) != passwordHash) {
      throw new ZodError([{
        message: "Incorrect password",
        path: ["old_password"],
        code: "custom",
      }]);
    }

    const newPasswordSalt = generateSalt();
    const newPasswordHash = hashPassword(input.new_password, newPasswordSalt);

    await db
      .updateTable("user")
      .set({
        password: generateStoredPassword(newPasswordHash, newPasswordSalt),
        updatedAt: dayjs().format(),
        updatedById: me.id,
      })
      .where("id", "=", me.id)
      .executeTakeFirstOrThrow();

    notifOk("Password successfully changed");
  });

const SchemaPasswordRequirements = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  pointsPerUnique: 3,
  pointsPerRepeat: 1.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
};