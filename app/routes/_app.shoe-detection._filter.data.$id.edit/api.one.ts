import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";
import { utilFilePathUrl } from "~/util/util.file-path-url";

export const apiOne = trpcProcedure
  .input(
    z.object({ id: z.string() })
  )
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const item = await db
      .selectFrom("shoeDetection")
      .select([
        "id",
        "brand",
        "model",
        "color",
        "gender",
        "imageName",
        "podium",
        "event",
        "distance",
        "minuteKm",
        "runningNum"
      ])
      .where("id", "=", input.id)
      .executeTakeFirst();

    if (!item) {
      throw new TRPCError({
        message: "Data not found",
        code: "BAD_REQUEST",
      });
    }

    return { item: { ...item, imageUrl: utilFilePathUrl("shoe-detection", item.imageName) } };
  });
