import dayjs from "dayjs";
import { z } from "zod";
import { dataCatMinuteKm, getDataCatMinuteKm, TCatMinuteKmId } from "~/data/data.cat-minute-km";
import { dataRunningDistance, TRunningDistanceId } from "~/data/data.running-distance";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";
import { utilPgSave } from "~/util/util.pg-save";

export const apiEdit = trpcProcedure
  .use(({ next, ctx: { notifDisableFor } }) => {
    notifDisableFor(["validateInput"]);
    return next();
  })
  .input(
    z.object({
      id: z.string(),
      brand: z.string().min(1, "Required"),
      model: z.string().min(1, "Required"),
      color: z.string().min(1, "Required"),
      event: z.string().min(1, "Required"),
      runningNum: z.string().min(1, "Required"),
      gender: z.enum(["MALE", "FEMALE"], {
        message: "Expected MALE or FEMALE"
      }),
      podium: z.enum(["YES", "NO"], {
        message: "Expected YES or NO"
      }),
      distance: z.enum(dataRunningDistance.map(i => i.id) as [TRunningDistanceId], {
        message: `${dataRunningDistance.map(i => i.id).join(", ")}`
      }),
      minuteKm: z.enum(dataCatMinuteKm.map(i => i.label) as [string], {
        message: [getDataCatMinuteKm('01_30').label, getDataCatMinuteKm('30_35').label, "..."].join(", ")
      })
    })
  )
  .mutation(async ({ input, ctx: { authUser, notifOk } }) => {
    const me = await authUser({ features: [] });
    await db
      .updateTable("shoeDetection")
      .set(utilPgSave({
        ...input,
        dataStatus: "EDITED",
        updatedAt: dayjs().format(),
        updatedById: me.id,
      }))
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();

    notifOk("Successfully edited");
  });
