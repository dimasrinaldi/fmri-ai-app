import { TSortDirectionId } from "~/data/data.sort-direction";
import { useQurlStore } from "~/provider/provider.qurl";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";

const storeUtil = utilCreateWidget({
    name: "SurveyList",
    useInitStore: (opt) => {
        const qurl = useQurlStore();

        const state = opt.useMobState(() => ({
            search: "",
            sortBy: "id",
            sortDirection: "desc" as TSortDirectionId,
            limit: 10,
            page: 0,
        }));

        const store = useCraftStore(() => ({
            get offset() { return store.page * store.limit },
            get items() { return ext.list.data.items },
            get count() { return ext.list.data.count },
            get isReachTotal() { return store.count <= store.items.length },
            get isListLoading() { return !ext.list.isFetched },
            onSetSearch(search: string) {
                state.setState({ search, page: 0 });
            },
            onSetSort(sortBy: string, sortDirection: TSortDirectionId) {
                state.setState({ sortBy, sortDirection });
            },
            onSetPagination(page: number, limit: number) {
                state.setState({ page, limit });
            },
            onClickSurveyList(id: string) {
                qurl.set(`/survey/${id}/info`)
            }, onMore() {
                const addedLimit = 10
                state.setState({ limit: store.limit + addedLimit })
            }
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            list: trpcUse.surveyList.useQuery({
                search: store.search,
                sortBy: store.sortBy,
                sortDirection: store.sortDirection,
                limit: store.limit,
                offset: store.offset,
            }, {
                initialData: {
                    items: [],
                    count: 0,
                },
            }),
        });

        return store;
    },

});

export const hocSurveyList = storeUtil.hocComp;
export const useSurveyListStore = storeUtil.useStore;
