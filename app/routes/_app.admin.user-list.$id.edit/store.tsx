import { useEffect } from "react";
import { TItemStatusId } from "~/data/data.item-status";
import { useQurlStore } from "~/provider/provider.qurl";
import { useAuthStore } from "~/root/auth/store";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobState } from "~/use/use.mob-state";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";
import { utilZodErrFromStr } from "~/util/util.zod-err-from-str";

const storeUtil = utilCreateWidget({
    name: "AdminUserListIdEdit",
    useInitStore: () => {
        const authStore = useAuthStore();
        const qurl = useQurlStore();
        const trpcUtils = trpcUse.useUtils();

        const state = useMobState(() => ({
            username: "",
            name: "",
            clientId: "",
            roleId: "",
            status: "Active" as TItemStatusId,

            formErrStr: "",

            openPasswordModal: false,
            password: "",
            passwordCopied: false,
        }));

        const store = useCraftStore(() => ({
            setState(arg: Partial<Omit<typeof state, "setState">>) {
                state.setState(arg);
            },
            get id() { return qurl.pathVal(2, "") },
            get isEdit() { return store.id != "new" },
            get meId() { return authStore.profile.id },
            get oneIsError() { return ext.one.isError },
            get oneIsLoading() { return ext.one.isFetching },
            get item() { return ext.one.data.item },
            get clients() { return ext.clients.data.items },
            get roles() { return ext.roles.data.items },
            get isSubmitLoading() { return ext.edit.isPending },
            get formErr() {
                return utilZodErrFromStr(store.formErrStr, [
                    "name",
                    "username",
                    "clientId",
                    "roleId",
                    "status",
                ]);
            },
            onSubmit() {
                if (!store.isEdit) {
                    ext.create.mutate({
                        name: store.name,
                        username: store.username,
                        clientId: store.clientId,
                        roleId: store.roleId,
                    });
                } else {
                    ext.edit.mutate({
                        id: store.id,
                        name: store.name,
                        clientId: store.clientId,
                        roleId: store.roleId,
                        status: store.status,
                    });
                }
            },
            onClose() {
                qurl.set(`/admin/user-list`);
                trpcUtils.adminUserList.refetch();
            },
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            one: trpcUse.adminUserListIdEditOne.useQuery({
                id: store.id,
            }, {
                enabled: store.isEdit,
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                initialData: {
                    item: {
                        name: "",
                        username: "",
                        clientId: "",
                        roleId: "",
                        status: "Active",
                    },
                },
            }),
            edit: trpcUse.adminUserListIdEdit.useMutation({
                onSuccess: () => {
                    store.onClose();
                },
                onError: ({ message }) => {
                    store.setState({ formErrStr: message });
                },
            }),
            create: trpcUse.adminUserListIdCreate.useMutation({
                onSuccess: (data) => {
                    store.setState({
                        password: data.password,
                        openPasswordModal: true,
                    });
                },
                onError: ({ message }) => {
                    store.setState({ formErrStr: message });
                },
            }),
            clients: trpcUse.adminUserListIdEditClients.useQuery({
                includeIds: [store.clientId],
            }, {
                initialData: {
                    items: [],
                },
            }),
            roles: trpcUse.adminUserListIdEditRoles.useQuery(undefined, {
                initialData: {
                    items: [],
                },
            }),
        });

        useEffect(() => {
            store.setState({ ...ext.one.data.item });
        }, [ext.one.isFetching])

        return store;
    },
});

export const hocAdminUserListIdEdit = storeUtil.hocComp;
export const useAdminUserListIdEditStore = storeUtil.useStore;
