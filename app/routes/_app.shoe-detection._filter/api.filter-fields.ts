import { z } from "zod";
import { db } from "~/db/db.app";
import { DbShoeDetection } from "~/db/db.shoe-detection";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiFilterFields = trpcProcedure
  .input(z.object({
    col: z.string(),
  }))
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });
    const col = input.col as keyof DbShoeDetection
    const items = await db.selectFrom("shoeDetection").select(`${col} as name`)
      .groupBy(col)
      .orderBy(col, "asc")
      .execute();
    return { items: items.map(i => ({ name: i.name?.toString() ?? "" })) };
  });
