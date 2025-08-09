import { use } from "echarts";
import { TSortDirectionId } from "~/data/data.sort-direction";
import { useQurlStore } from "~/provider/provider.qurl";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";
import { useSurveyIdStore } from "../_app.survey.$id/store";

const storeUtil = utilCreateWidget({
    name: "SurveyIdData",
    useInitStore: (opt) => {
        const qurl = useQurlStore();
        const surveyId = useSurveyIdStore();
        const state = opt.useMobState(() => ({
            search: "",
            sortBy: "id",
            sortDirection: "desc" as TSortDirectionId,
            limit: 20,
            page: 0,
        }));

        const store = useCraftStore(() => ({
            get surveyId() { return surveyId.surveyId },
            get offset() { return store.page * store.limit },
            get items() { return ext.list.data.items },
            get count() { return ext.list.data.count },
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
            onCreate() {
                qurl.set("/roles/create");
            },
            onEdit(id: string) {
                qurl.set(`/roles/${id}/edit`);
            },
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            list: trpcUse.surveyIdDataList.useQuery({
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
                },
            }),
        });

        return store;
    },

});

export const hocSurveyIdData = storeUtil.hocComp;
export const useSurveyIdDataStore = storeUtil.useStore;
