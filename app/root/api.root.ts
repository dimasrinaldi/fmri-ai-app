import { trpcProcedure } from "~/trpc/trpc.app";
import { utilPublicEnv } from "~/util/util.public-env";

export const apiRoot = trpcProcedure
  .query(async () => {
    return utilPublicEnv();
  });
