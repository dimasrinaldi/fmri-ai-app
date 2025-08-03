import { createCookie } from "@remix-run/node"; // or cloudflare/deno
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/fetch";
import { configServer } from "~/config/config.server";
import { trpcCreateAuth } from "./trpc.create-auth";

export const userPrefs = createCookie(configServer.cookieKey, {
  secrets: [configServer.cookieSecret],
  maxAge: 60 * 60 * 24 * 7, // one week
  httpOnly: true,
  secure: configServer.useSsl,
  sameSite: "lax",
});

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function trpcCreateContextInner(
  _opts: trpcNext.FetchCreateContextFnOptions
) {
  // await utilSleep(1_000)
  const cookieHeader = _opts.req.headers.get("cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  const setMyCookie = async (userId: string) => {
    cookie.userId = userId;
    _opts.resHeaders.set("set-cookie", await userPrefs.serialize(cookie));
  };
  const delMyCookie = async () => {
    cookie.userId = "";
    _opts.resHeaders.set("set-cookie", await userPrefs.serialize(cookie));
  };
  const authUser = trpcCreateAuth(cookie);
  _opts.resHeaders.set("set-cookie", await userPrefs.serialize(cookie));

  const notifOk = (
    message: string,
    type: ("success" | "error" | "warning" | "info") = "success"
  ) => {
    _opts.resHeaders.set("_notif", `${message}##${type}`);
  };
  const notifDisableFor = (type: ("validateInput" | "mutateOk" | "all")[]) => {
    _opts.resHeaders.set("_notifdisabled", type.join(","));
  };

  const reqUrl = () => new URL(_opts.req.url);

  return {
    setMyCookie,
    delMyCookie,
    authUser,
    notifOk,
    notifDisableFor,
    reqUrl,
  };
}

export type TrpcContext = trpc.inferAsyncReturnType<typeof trpcCreateContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.FetchCreateContextFnOptions
): Promise<TrpcContext> {
  // for API-response caching see https://trpc.io/docs/caching
  return await trpcCreateContextInner(opts);
}
