import { Bubble } from "@ant-design/x";
import { CoreMessage } from "ai";
import { GetProp } from "antd";
import { json2csv } from "json-2-csv";
import _ from "lodash";
import { useEffect } from "react";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobState } from "~/use/use.mob-state";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";
import { useAppStore } from "../store";
import { TTabId } from "./data.tab";
import { useUpdateEffect } from "react-use";
import { useQurlStore } from "~/provider/provider.qurl";

const storeUtil = utilCreateWidget({
    name: "AppViewChatModal",
    useInitStore: (opt) => {
        const app = useAppStore();
        const state = opt.useMobState(() => ({
            tab: "chat" as TTabId,
            message: "",
            messages: [] as CoreMessage[],
        }));

        const store = useCraftStore(() => ({
            get isModalOpen() { return app.isModalOpen },

            get aiActiveData() { return app.activeAiData },
            get aiSystemPrompt() {
                const pageTitle = (document.getElementsByTagName("title")?.[0]?.innerText ?? "Unknown").split("-")[0].trim();
                const filterElement = document.getElementsByClassName("stats-filter-item");
                const filterStr = Array.from(filterElement).map(i => {
                    const col = i.textContent?.trim().split(":")[0];
                    const vals = Array.from(i.getElementsByClassName("ant-tag")).map(tag => tag.textContent?.trim()).join(",");
                    return `${col}:(${vals})`;
                }).join(" AND ");

                const getPrompt = (forDisplay = true) => {
                    let result = forDisplay
                        ? `Data title: ${pageTitle}`
                        : `You are ${pageTitle} expert, please answer based on below data.`;
                    if (filterElement.length > 0) {
                        result += `\nThe data are filtered using\n${filterStr}`;
                    }
                    store.aiActiveData.forEach(i => {
                        result += `\n------`
                        result += `\nTable Title : ${i.title}`;
                        result += `\nTable Data (csv):\n`;
                        result += json2csv(i.data, {
                            delimiter: { field: "|" },
                        });
                    })
                    return result
                }
                return {
                    pageTitle,
                    forDisplay: getPrompt(true),
                    forPrompt: getPrompt(false),
                };
            },
            onSetTab(tab: TTabId) {
                state.setState({ tab })
            },
            get setModal() { return app.setAiModal },
            // chat bot
            get isAskLoading() {
                return ext.ask.isPending
            },
            get chatMessages() {
                let result: GetProp<typeof Bubble.List, 'items'> = store.messages.map((i, ix) => {
                    return {
                        id: ix.toString(),
                        content: i.content,
                        role: i.role == "assistant" ? "ai" : "local",
                    }
                })
                if (store.isAskLoading) {
                    result.push({
                        id: "loading",
                        content: "Loading...",
                        role: "ai",
                        loading: true,
                    })
                }
                return result;
            },
            onChangeSender(message: string) {
                state.setState({ message })
            }, onSubmitSender() {
                if (store.isAskLoading) return;
                const messages = _.concat(_.clone(store.messages), {
                    content: store.message,
                    role: "user"
                });
                state.setState({ messages, message: "" })
                ext.ask.mutate({ messages, systemPrompt: store.aiSystemPrompt.forPrompt })
            }, askMessage(message: string) {
                state.setState({ message });
                store.onSubmitSender();
            }, onAskOk(args: { answer: string }) {
                let offset = store.messages.length - 10;
                if (offset < 0) offset = 0;
                const messages = _.concat(_.clone(store.messages).slice(offset), [{
                    content: args.answer,
                    role: "assistant"
                }]);
                state.setState({ messages })
            }, onClearChat() {
                state.setState({ messages: [] })
            }
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            ask: trpcUse.appChatModalAsk.useMutation({
                onSuccess: ({ answer, isAnswerError, reffData }) => {
                    store.onAskOk({ answer });
                    isAnswerError && console.log(reffData);
                },
                onError: () => {
                    store.onAskOk({ answer: `Oops! Something went wrong. Please check your input and try again.` })
                }
            }),
        });

        useUpdateEffect(() => {
            store.onClearChat();
        }, [JSON.stringify(app.aiData).length,])

        return store;
    },

});

export const hocViewChatModal = storeUtil.hocComp;
export const useViewChatModalStore = storeUtil.useStore;


// const getEchartPivot = (items: {
//     row: string;
//     col: string;
//     val: number
// }[], mode: "value" | "percent" = "value") => {
//     const categories = _.uniq(items.map((i) => i.row));
//     const cattotalCount = categories.map((i) => {
//         const total = _.sum(items.filter((ii) => ii.row == i).map((ii) => ii.val))
//         return { category: i, total }
//     })
//     const stackNames = _.uniq(items.map((i) => i.col));
//     const dataSeries = stackNames.map((i) => {
//         const catItems = categories.map(catName => {
//             return items.find(ii => ii.row == catName && ii.col == i)
//         })
//         return {
//             name: i,
//             type: 'bar',
//             stack: 'total',
//             label: {
//                 show: true,
//                 formatter: (params: { value: number }) => Math.round(params.value) + (mode == "value" ? '' : '%')
//             },
//             data: catItems.map(i => {
//                 const totalCount = cattotalCount.find(ii => ii.category == i.row)?.total ?? 1;
//                 return mode == "value" ? i.val : Math.round(i.val * 100 / totalCount)
//             })
//         }
//     })
//     return { categories, dataSeries }
// }
