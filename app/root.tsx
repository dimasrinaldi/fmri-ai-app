import { createCache, extractStyle } from "@ant-design/cssinjs";
import Entity from "@ant-design/cssinjs/lib/Cache";
import { QuestionCircleFilled } from "@ant-design/icons";
import resetStyle from "@refinedev/antd/dist/reset.css";
import type { ErrorResponse, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError
} from "@remix-run/react";
import { App as AntdApp, Button, ConfigProvider, Flex, Result } from "antd";
import { StyleProvider } from "antd-style";
import appLocale from 'antd/locale/en_US';
import cssProgress from "nprogress/nprogress.css";
import React from "react";
import { renderToString } from "react-dom/server";
import toastCss from "react-toastify/dist/ReactToastify.css";
import globalCss from "~/css/global.css";
import iconCss from "./css/icon.css";
import { ProviderQurl } from "./provider/provider.qurl";
import { ProviderTrpc } from "./provider/provider.trpc";
import Root from "./root/index";
import { useTheme } from "./use/use.theme";
import { utilMajson } from "./util/util.majson";
import { utilPublicEnv } from "./util/util.public-env";
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

export default function App() {
  const theme = useTheme();
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
              <StyleProvider hashPriority="high">
                <ConfigProvider theme={theme} locale={appLocale} >
                  <AntdApp>
                    <Root>
                      <Outlet />
                    </Root>
                  </AntdApp>
                </ConfigProvider>
              </StyleProvider>
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
export function ErrorBoundary() {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const error = useRouteError() as ErrorResponse;
  const title = error?.status == 404 ? "Page not found" : "Something went wrong";
  const subTitle = error?.status == 404 ? "Looks like that page does not exist." : "Looks like something went wrong on our side.";

  const html = <Flex align="center" justify="center" style={{ height: "100vh" }}>
    <Result
      {...(error?.status == 404 ? { icon: <QuestionCircleFilled /> } : { status: "error" })}
      title={title}
      subTitle={subTitle}
      extra={
        <Button
          type="primary"
          size="large"
          href="/"
        >
          Back home
        </Button>
      }
    />
  </Flex>;

  renderToString(<StyleProvider cache={cache}>{html}</StyleProvider>);
  const styleText = extractStyle(cache);

  return (<html lang="en">
    <head>
      <title>
        {title}
      </title>
    </head>
    <body>
      {html}
      <div dangerouslySetInnerHTML={{
        __html: styleText,
      }} />
    </body>
  </html>);
}