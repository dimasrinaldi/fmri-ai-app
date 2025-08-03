import _ from "lodash";
import moment from "moment";
import { TSortDirectionId } from "~/data/data.sort-direction";
import { useQurlStore } from "~/provider/provider.qurl";
import { useAuthStore } from "~/root/auth/store";
import { trpcFetch, trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilDownloadCsv } from "~/util/util.download-csv";
import { utilOmit } from "~/util/util.omit";
import { useShoeDetectionFilterStore } from "../_app.shoe-detection._filter/store";
import { useAppStore } from "../_app/store";

const storeUtil = utilCreateWidget({
    name: "ShoeDetectionData",
    useInitStore: (opt) => {
        const trpcUtils = trpcUse.useUtils();
        const qurl = useQurlStore();
        const app = useAppStore();
        const auth = useAuthStore();
        const filterStore = useShoeDetectionFilterStore();
        const state = opt.useMobState(() => ({
            search: "",
            sortBy: "id",
            sortDirection: "desc" as TSortDirectionId,
            limit: 10,
            page: 0,

            csvLoading: false
        }));

        const store = useCraftStore(() => ({
            get clientId() { return app.activeClient.id },
            get access() {
                return {
                    featurePrivileged: auth.canAccess(["Feature_Privileged"])
                }
            },
            get apiQuery() {
                return {
                    clientIds: [app.activeClient.id],
                    ...filterStore.apiQuery,
                    search: store.search,
                    sortBy: store.sortBy,
                    sortDirection: store.sortDirection,
                    limit: store.limit,
                    offset: store.offset,
                }
            },
            get maxSelectedRows() { return 100 },
            get offset() { return store.page * store.limit },
            get items() { return ext.list.data.items },
            get count() { return ext.list.data.count },
            get isListLoading() { return !ext.list.isFetched },
            getFilteredItemsByAcl: (items: any[]): any[] => {
                const myItems = _.cloneDeep(items).map(i => {
                    return _.omit(i, ["imageName", "updatedBy", "thumbnail", "updatedAt", "dataStatus"])
                })
                if (store.access.featurePrivileged) return myItems;
                return myItems
            },
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
                qurl.set(`/shoe-detection/data/${id}/edit`);
            },
            onDownloadAllData() {
                state.setState({ csvLoading: true });
                trpcFetch.shoeDetectionDataList.query({
                    clientIds: [app.activeClient.id],
                    limit: 100_000
                }).then(data => {
                    const filteredItems = store.getFilteredItemsByAcl(data.items);
                    const date = moment().format("YYYY-MM-DDTHH-mm-ss");
                    const clientName = app.activeClient.name;
                    const filename = `${clientName}-shoe-detection-data-all-${date}.csv`
                    utilDownloadCsv(filteredItems, filename);
                    state.setState({ csvLoading: false });
                })
            },
            onDownloadData() {
                const myItems = store.getFilteredItemsByAcl(store.items)
                if (myItems.length < 0) return;
                const date = moment().format("YYYY-MM-DDTHH-mm-ss");
                const clientName = app.activeClient.name;
                const filename = `${clientName}-shoe-detection-data-${date}.csv`
                utilDownloadCsv(myItems, filename);
            }
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            list: trpcUse.shoeDetectionDataList.useQuery(
                store.apiQuery, {
                initialData: {
                    items: [],
                    count: 0,
                },
            }),
        });

        return store;
    },

});

export const hocShoeDetectionData = storeUtil.hocComp;
export const useShoeDetectionDataStore = storeUtil.useStore;
