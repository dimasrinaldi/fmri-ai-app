import { TItemStatusId } from "~/data/data.item-status";
import { TSortDirectionId } from "~/data/data.sort-direction";
import { useQurlStore } from "~/provider/provider.qurl";
import { useAuthStore } from "~/root/auth/store";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";

const storeUtil = utilCreateWidget({
    name: "AdminUserList",
    useInitStore: (opt) => {
        const qurl = useQurlStore();
        const auth = useAuthStore()
        const state = opt.useMobState(() => ({
            search: "",
            sortBy: "id",
            sortDirection: "desc" as TSortDirectionId,
            limit: 10,
            page: 0,
            status: "Active" as TItemStatusId,
        }));

        const store = useCraftStore(() => ({
            get meId() { return auth.profile.id },
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
                qurl.set("/admin/user-list/new/edit");
            },
            onEdit(id: string) {
                qurl.set(`/admin/user-list/${id}/edit`);
            },
            onResetPassword(id: string) {
                qurl.set(`/admin/user-list/${id}/reset-password`);
            },
            onSetStatus(status: TItemStatusId) {
                state.setState({ status, page: 0 });
            },
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            list: trpcUse.adminUserList.useQuery({
                status: store.status,
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

export const hocAdminUserList = storeUtil.hocComp;
export const useAdminUserListStore = storeUtil.useStore;
