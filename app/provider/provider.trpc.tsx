import { httpBatchLink } from "@trpc/client";
import _ from "lodash";
import nprogress from "nprogress";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import validator from "validator";
import { trpcUse } from "~/trpc/trpc.fetch";
import { utilTitleCase } from "~/util/util.title-case";
import { utilWindow } from "~/util/util.window";
import { toast } from "react-toastify";

type TProps = {
    children: ReactNode;
};
const mytrpc = trpcUse;
export const ProviderTrpc = (props: TProps) => {
    if (typeof window == "undefined") return null;
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        mytrpc.createClient({
            links: [
                httpBatchLink({
                    url: "/api/trpc",
                    fetch: async (url, opt) => {
                        const path = utilWindow().location.pathname;
                        if (opt?.headers) {
                            // @ts-ignore
                            opt.headers["_path"] = path;
                        }
                        addAjax();
                        const result = await fetch(url, opt).finally(() => delAjax());

                        let [notifMessage = "", notifType = "success"] = (result.headers.get("_notif") ?? "").split("##");

                        const notifDisabledStr = result.headers.get("_notifdisabled") ?? "";
                        const notifDisabled = notifDisabledStr.split(",").filter((i) => i);

                        if (result.status == 200) {
                            if (notifMessage.length == 0 && opt?.method == "POST" && !notifDisabled.includes("mutateOk")) {
                                notifMessage = "Success";
                            }
                        } else {
                            const response = result.clone();
                            const data: any[] = (await response.json()).filter((i: any) => i.error);
                            let message: string = data[0]?.error?.message ?? response.statusText;

                            const isZodErrFormat = message.includes(`"code":`)
                                && message.includes(`"message":`)
                                && message.includes(`"path":`);
                            const isErrInputValidation = validator.isJSON(message)
                                && isZodErrFormat
                                && _.isArray(JSON.parse(message));

                            if (validator.isJSON(message)) {
                                const msgData = JSON.parse(message);
                                message = `${utilTitleCase(msgData[0]?.path[0] ?? "")}: ${msgData[0]?.message}`;
                            }
                            const hasStatusAuth = data.filter((i) => [401, 403].includes(i.error?.data?.httpStatus)).length > 0;
                            let has400 = data.filter((i) => 400 == i.error?.data?.httpStatus).length > 0;
                            if (message.toLowerCase().includes("constraint")) {
                                has400 = true;
                            }

                            if (hasStatusAuth) {
                                notifMessage = "Unauthorized";
                            } else if (!has400) {
                                notifMessage = "Something went wrong";
                            } else {
                                notifMessage = message;
                            }
                            notifType = "error";

                            if (
                                notifDisabled.includes("validateInput") && isErrInputValidation
                                || notifDisabled.includes("all")
                            ) {
                                notifMessage = "";
                            }
                        }

                        if (notifMessage.length > 0 && typeof window !== "undefined") {
                            toast(notifMessage, {
                                toastId: generateToastId(),
                                type: notifType as any,
                                position: "bottom-left",
                            });
                        }
                        return result;
                    },
                }),
            ],
        })
    );

    return <mytrpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    </mytrpc.Provider>
}

let count = 0;
function addAjax() {
    nprogress.start();
    ++count;
}
function delAjax() {
    if (count > 0) {
        --count;
    }
    if (count < 1) {
        nprogress.done();
    }
}

function generateToastId() {
    return `autonotif-${Math.floor(Math.random() * 10000)}`;
}

