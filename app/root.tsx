import { RefineThemes } from "@refinedev/antd";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import resetStyle from "@refinedev/antd/dist/reset.css";
import { App as AntdApp, Button, ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import Root from "./root/index";
import { ProviderTrpc } from "./provider/provider.trpc";
import { ProviderQurl } from "./provider/provider.qurl";
import globalCss from "~/css/global.css";
import iconCss from "./css/icon.css";
import { utilMajson } from "./util/util.majson";
import { utilPublicEnv } from "./util/util.public-env";
// import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import cssProgress from "nprogress/nprogress.css";
import toastCss from "react-toastify/dist/ReactToastify.css";
import { ViewClientOnly } from "./view/view.client-only";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: resetStyle },
  { rel: "stylesheet", href: cssProgress },
  { rel: "stylesheet", href: toastCss },
  { rel: "stylesheet", href: globalCss },
  { rel: "stylesheet", href: iconCss },
  { rel: "stylesheet", href: utilPublicEnv().cssPath },
  { rel: "icon", href: utilPublicEnv().faviconPath, sizes: "32x32", type: "image/png" },
];

export default function App(): JSX.Element {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ViewClientOnly>{() =>

          <ProviderTrpc>
            <ProviderQurl>
              <Root>
                <Outlet />
                <h1>Cumigoreng</h1>
              </Root>
            </ProviderQurl>
          </ProviderTrpc>

        }</ViewClientOnly>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${utilMajson.stringify(utilPublicEnv())}`,
          }}
        />
      </body>
    </html >
  );
}

// export function links() {
//   return [{ rel: "stylesheet", href: resetStyle }];
// }

// function ClientOnly({ children }: { children: React.ReactNode }) {
//   const [hasMounted, setHasMounted] = useState(false);

//   useEffect(() => {
//     setHasMounted(true);
//   }, []);

//   if (!hasMounted) return null;
//   return <>{children}</>;
// }
