import { Bubble } from "@ant-design/x";
import { CoreMessage } from "ai";
import { GetProp } from "antd";
import _ from "lodash";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";
import { useSurveyIdStore } from "../_app.survey.$id/store";

const storeUtil = utilCreateWidget({
    name: "SurveyIdChat",
    useInitStore: (opt) => {
        const surveyId = useSurveyIdStore();
        const state = opt.useMobState(() => ({
            message: "",
            messages: [] as CoreMessage[],
            isChatListReady: false,
        }));

        const store = useCraftStore(() => ({
            get surveyId() {
                return surveyId.surveyId
            },
            get isAskLoading() {
                return ext.ask.isPending
            }, get chatMessages() {
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
                ext.ask.mutate({ surveyId: store.surveyId, messages })
            }, scrollToBottom() {
                const scrollHeight = document.body.scrollHeight;
                window.scrollTo({
                    top: scrollHeight,
                    behavior: "smooth"
                });
            }, onLoadChatList() {
                state.setState({ isChatListReady: true })
            }, onClearChat() {
                state.setState({ messages: [] })
            }, onAskOk(args: { answer: string }) {
                let offset = store.messages.length - 10;
                if (offset < 0) offset = 0;
                const messages = _.concat(_.clone(store.messages).slice(offset), [{
                    content: args.answer,
                    role: "assistant"
                }]);
                state.setState({ messages })
            }, askMessage(message: string) {
                state.setState({ message });
                store.onSubmitSender();
            }
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            ask: trpcUse.surveyIdChatAsk.useMutation({
                onSuccess: ({ answer, isAnswerError, reffData }) => {
                    store.onAskOk({ answer });
                    isAnswerError && console.log(reffData);
                },
                onError: () => {
                    store.onAskOk({ answer: `Oops! Something went wrong. Please check your input and try again.` })
                }
            }),
        });

        return store;
    },
});

export const hocSurveyIdChat = storeUtil.hocComp;
export const useSurveyIdChatStore = storeUtil.useStore;
