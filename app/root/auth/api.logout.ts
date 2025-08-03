import { trpcProcedure } from "~/trpc/trpc.app";

export const apiLogout = trpcProcedure
  .mutation(async ({ ctx: { delMyCookie, notifDisableFor } }) => {
    await delMyCookie();
    notifDisableFor(["mutateOk"]);
  });
