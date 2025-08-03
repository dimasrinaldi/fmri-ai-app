/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */

import { initTRPC } from "@trpc/server";
// import { utilMajson } from "~/util/util.majson";
import { TrpcContext } from "./trpc.context";
// import superjson from "superjson";

const t = initTRPC.context<TrpcContext>().create({
  /**
   * @see https://trpc.io/docs/v10/data-transformers
   */
  // transformer: superjson,
  /**
   * @see https://trpc.io/docs/v10/error-formatting
   */
  errorFormatter(arg) {
    return arg.shape;
  },
});

/**
 * Create a router
 * @see https://trpc.io/docs/v10/router
 */
export const trpcRouter = t.router;

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/v10/procedures
 **/
export const trpcProcedure = t.procedure;

/**
 * @see https://trpc.io/docs/v10/middlewares
 */
export const trpcMiddleware = t.middleware;

/**
 * @see https://trpc.io/docs/v10/merging-routers
 */
export const trpcMergeRouters = t.mergeRouters;
