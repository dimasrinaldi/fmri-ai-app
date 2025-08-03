import { z } from "zod";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";
import { utilFilePath } from "~/util/util.file-path";
import { utilMinIo } from "~/util/util.minio";

export const apiDelete = trpcProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input, ctx: { authUser, notifOk } }) => {
    await authUser({ features: [] });

    await db.transaction().execute(async (trx) => {

      const item = await trx
        .selectFrom("shoeDetection")
        .select(["imageName"])
        .where("id", "=", input.id)
        .executeTakeFirst();

      const imageName = item?.imageName ?? "bh2ufd8";

      await trx
        .deleteFrom("shoeDetection")
        .where("id", "=", input.id)
        .executeTakeFirst();

      const existImageDb = await trx
        .selectFrom("shoeDetection")
        .select(["id"])
        .where("imageName", "=", imageName)
        .executeTakeFirst();

      if (existImageDb) return;

      await utilMinIo(i => i.client.removeObject(i.bucket, utilFilePath("shoe-detection", imageName)))

    });

    notifOk("Successfully deleted");
  });
