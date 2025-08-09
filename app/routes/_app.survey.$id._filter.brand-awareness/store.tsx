import { TSortDirectionId } from "~/data/data.sort-direction";
import { useQurlStore } from "~/provider/provider.qurl";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobState } from "~/use/use.mob-state";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";

const storeUtil = utilCreateWidget({
    name: "SurveyIdBrandAwareneness",
    useInitStore: (opt) => {
        const qurl = useQurlStore();

        const state = opt.useMobState(() => ({
            search: "",
            sortBy: "id",
            sortDirection: "desc" as TSortDirectionId,
            limit: 15,
            page: 0,
        }));

        const store = useCraftStore(() => ({
            get offset() { return store.page * store.limit },
            get isApiInitFetched() { return ext.isApiInitFetched },
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
        });

        return store;
    },

});

export const hocSurveyIdBrandAwareneness = storeUtil.hocComp;
export const useSurveyIdBrandAwarenenessStore = storeUtil.useStore;
