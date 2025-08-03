import { createContext } from "~/trpc/trpc.context";
import { appRouter } from "~/trpc/trpc.router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export const loader = async (args: LoaderFunctionArgs) => {
  return handleRequest(args);
};
export const action = async (args: ActionFunctionArgs) => {
  return handleRequest(args);
};
function handleRequest(args: LoaderFunctionArgs | ActionFunctionArgs) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: args.request,
    router: appRouter,
    createContext,
  });
}
