import _ from "lodash";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiProfile = trpcProcedure
  .query(async ({ ctx: { authUser } }) => {
    const user = await authUser({ defaultAsGuest: true });
    return _.omit(user, ["canAccess"]);
  });
