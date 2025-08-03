import { utilCreateWidget } from "~/util/util.create-widget";
import { useQurlStore } from "~/provider/provider.qurl";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useMobState } from "~/use/use.mob-state";
import { useCraftStore } from "~/use/use.craft-store";
import { utilOmit } from "~/util/util.omit";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { Button } from "antd";
import { useAuthStore } from "~/root/auth/store";

const storeUtil = utilCreateWidget({
    name: "AdminUserListIdResetPassword",
    useInitStore: () => {
        const authStore = useAuthStore();
        const qurl = useQurlStore();
        const trpcUtils = trpcUse.useUtils();

        const state = useMobState(() => ({
            password: "",
            openPasswordModal: false,
            passwordCopied: false,
        }));

        const store = useCraftStore(() => ({
            setState(arg: Partial<Omit<typeof state, "setState">>) {
                state.setState(arg);
            },
            get id() { return qurl.pathVal(2, "") },
            get meId() { return authStore.profile.id },
            get userData() { return ext.one.data.item },
            get isSubmitLoading() { return ext.resetPassword.isPending },
            get isApiInitFetched() { return ext.isApiInitFetched },
            get isFound() { return ext.one.isSuccess },
            onSubmit() {
                ext.resetPassword.mutate({ id: store.id });
            },
            onClose() {
                qurl.set("/admin/user-list");
                trpcUtils.adminUserList.refetch();
            },
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            one: trpcUse.adminUserListIdResetPasswordOne.useQuery({
                id: store.id,
            }, {
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                initialData: {
                    item: {
                        name: "",
                        username: "",
                    },
                },
            }),
            resetPassword: trpcUse.adminUserListIdResetPassword.useMutation({
                onSuccess: (data) => {
                    store.setState({
                        password: data.password,
                        openPasswordModal: true,
                    });
                },
            }),
        });

        return store;
    },
});

export const hocAdminUserListIdResetPassword = storeUtil.hocComp;
export const useAdminUserListIdResetPasswordStore = storeUtil.useStore;
