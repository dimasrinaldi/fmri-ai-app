import { RefineThemes } from "@refinedev/antd";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

//@ts-ignore
import resetStyle from "@refinedev/antd/dist/reset.css";
import { App as AntdApp, Button, ConfigProvider } from "antd";

import { useEffect, useState } from "react";
import Root from "./root/index";
import { ProviderTrpc } from "./provider/provider.trpc";
import { ProviderQurl } from "./provider/provider.qurl";
import { ViewClientOnly } from "./view/view.client-only";

export const meta: MetaFunction = () => [
  {
    charset: "utf-8",
    title: "New Remix + Refine App",
    viewport: "width=device-width,initial-scale=1",
  },
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
          <ConfigProvider theme={RefineThemes.Purple}>
            <AntdApp>
              <ProviderTrpc>
                <ProviderQurl>
                  <Root>
                    <Button>Halobandung</Button>
                  </Root>
                </ProviderQurl>
              </ProviderTrpc>
            </AntdApp>
          </ConfigProvider>
        }</ViewClientOnly>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html >
  );
}

export function links() {
  return [{ rel: "stylesheet", href: resetStyle }];
}

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  return <>{children}</>;
}
