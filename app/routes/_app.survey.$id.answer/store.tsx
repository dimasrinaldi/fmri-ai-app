import { TSortDirectionId } from "~/data/data.sort-direction";
import { useQurlStore } from "~/provider/provider.qurl";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";
import { useSurveyIdStore } from "../_app.survey.$id/store";
import { utilSleep } from "~/util/util.sleep";
import _ from "lodash";
import { useMount } from "react-use";

const storeUtil = utilCreateWidget({
    name: "SurveyIdAnswer",
    useInitStore: (opt) => {
        const surveyId = useSurveyIdStore();

        const state = opt.useMobState(() => ({
            search: "",
            sortBy: "updatedAt",
            sortDirection: "asc" as TSortDirectionId,
            page: 0,

            answeringOffset: 0,
            answeringTotalCount: 0,
            answering: false
        }));

        const store = useCraftStore(() => ({
            get surveyId() { return surveyId.surveyId },
            get limit() { return 1 },
            get offset() { return store.page * store.limit },
            get items() { return ext.list.data.items },
            get surveyData() { return ext.list.data.surveyData },
            get count() { return ext.list.data.count },
            get countTotal() { return ext.list.data.countTotal },
            get countPercent() { return store.countTotal == 0 ? 0 : _.floor(store.count / store.countTotal * 100, 2) },
            get isListLoading() { return !ext.list.isFetched },
            // get isAnsweringLoading() { return ext.answering.isPending || store.answering },
            get answeringStatus(): "idle" | "answering" | "stopping" {
                if (store.answering == true) return "answering";
                if (store.answering == false && ext.answering.isPending) return "stopping";
                return "idle"
            },
            get isClearAnswerLoading() { return ext.clearAnswer.isPending },
            onSetSearch(search: string) {
                state.setState({ search, page: 0 });
            },
            onSetSort(sortBy: string, sortDirection: TSortDirectionId) {
                state.setState({ sortBy, sortDirection });
            },
            onSetPagination(page: number, limit: number) {
                state.setState({ page });
            },
            onStopAnswerAi() {
                state.setState({ answering: false });
            },
            onClearAnswers() {
                ext.clearAnswer.mutate({
                    surveyId: store.surveyId,
                }, {
                    onSuccess() {
                        ext.list.refetch();
                        state.setState({ page: 0 });
                    }
                })
            },
            onStartAnswerAi() {
                state.setState({ answering: true });
                if (ext.answering.isPending) return;
                const answering = () => ext.answering.mutate({
                    surveyId: store.surveyId,
                }, {
                    onError() {
                        state.setState({ answering: false });
                    },
                    async onSuccess(data) {
                        let result = {
                            answeringTotalCount: Number(data.totalCount),
                            answering: state.answering,
                        };
                        ext.list.refetch();
                        if (data.isEnd) {
                            result.answering = false;
                        }
                        await utilSleep(3_000)
                        state.setState(result)
                        if (!result.answering) return;
                        answering();
                    },
                });
                answering();
            },
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            list: trpcUse.surveyIdAnswerList.useQuery({
                surveyId: store.surveyId,
                search: store.search,
                sortBy: store.sortBy,
                sortDirection: store.sortDirection,
                limit: store.limit,
                offset: store.offset,
            }, {
                initialData: {
                    items: [],
                    count: 0,
                    countTotal: 0,
                    surveyData: [],
                },
            }),
            answering: trpcUse.surveyIdAnswerAnswering.useMutation(),
            clearAnswer: trpcUse.surveyIdAnswerClearAnswer.useMutation()
        });

        useMount(() => {
            if (store.answeringStatus == "answering" && !ext.answering.isPending) {
                store.onStartAnswerAi();
            }
        })

        return store;
    },

});

export const hocSurveyIdAnswer = storeUtil.hocComp;
export const useSurveyIdAnswerStore = storeUtil.useStore;
