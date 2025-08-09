import _ from "lodash";
import { z } from "zod";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiOne = trpcProcedure
  .input(z.object({
    id: z.string().ulid()
  }))
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });
    const items = await db.selectFrom("survey").select([
      "title",
      "respondentType"
    ]).where("id", "=", input.id)
      .limit(1)
      .execute();
    return { items };
  });
