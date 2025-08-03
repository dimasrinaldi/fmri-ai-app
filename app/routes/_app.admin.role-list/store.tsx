import { dataAcl, getDataAcl } from "~/data/data.acl";
import { TSortDirectionId } from "~/data/data.sort-direction";
import { useQurlStore } from "~/provider/provider.qurl";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";

const storeUtil = utilCreateWidget({
    name: "AdminRoleList",
    useInitStore: (opt) => {

        const state = opt.useMobState(() => ({
            search: "",
            sortBy: "id",
            sortDirection: "desc" as TSortDirectionId,
            limit: 10,
            page: 0,

            detailId: "",
        }));

        const store = useCraftStore(() => ({
            get offset() { return store.page * store.limit },
            get items() { return ext.list.data.items },
            get count() { return ext.list.data.count },
            get isListLoading() { return !ext.list.isFetched },
            get detail() {
                const role = store.items.find(i => i.id == store.detailId);
                if (!role) return;
                const result = {
                    ...role,
                    describes: dataAcl.filter(i => role.acl.includes(i.id))
                }
                return result;
            },
            get isDetilOpen() {
                return typeof store.detail != "undefined"
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
            onSetDetailId(detailId: string) {
                state.setState({ detailId })
            }
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            list: trpcUse.adminRoleList.useQuery({
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

export const hocAdminRoleList = storeUtil.hocComp;
export const useAdminRoleListStore = storeUtil.useStore;
