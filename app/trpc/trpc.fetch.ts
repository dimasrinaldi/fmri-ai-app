import { createTRPCClient, httpLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./trpc.router";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  // Change it to point to you SSR base URL
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpcFetch = createTRPCClient<AppRouter>({
  // transformer: sJson,
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development"
        || (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpLink({
      url: `${getBaseUrl()}/api/trpc`, // We need to setup Server Side API to point to this
    }),
  ],
});

export const trpcUse = createTRPCReact<AppRouter>({
  abortOnUnmount: true,
});

