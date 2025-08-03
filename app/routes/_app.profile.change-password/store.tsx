import { utilCreateWidget } from "~/util/util.create-widget";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useQurlStore } from "~/provider/provider.qurl";
import { useMobState } from "~/use/use.mob-state";
import { utilZodErrFromStr } from "~/util/util.zod-err-from-str";
import { utilOmit } from "~/util/util.omit";

const storeUtil = utilCreateWidget({
    name: "ProfileChangePassword",
    useInitStore: () => {
        const qurl = useQurlStore();
        console.log("hsjdfhsdkjfhsdkjfh")
        const state = useMobState(() => ({
            oldPassword: "",
            newPassword: "",
            passwordConfirmation: "",

            formErrStr: "",
        }));

        const store = useCraftStore(() => ({
            setState(arg: Partial<Omit<typeof state, "setState">>) {
                state.setState(arg);
            },
            get isSubmitLoading() { return ext.changePassword.isPending },
            get formErr() {
                return utilZodErrFromStr(store.formErrStr, [
                    "old_password",
                    "new_password",
                    "password_confirmation",
                ]);
            },
            get isApiInitFetched() { return ext.isApiInitFetched },
            onSubmit() {
                ext.changePassword.mutate({
                    old_password: store.oldPassword,
                    new_password: store.newPassword,
                    password_confirmation: store.passwordConfirmation,
                });
            },
            onClose() {
                qurl.set("/profile");
                // trpcUtils.profileUserInfo.refetch();
            },
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            changePassword: trpcUse.adminChangePassword.useMutation({
                onSuccess: () => {
                    store.onClose();
                },
                onError: ({ message }) => {
                    store.setState({ formErrStr: message });
                },
            }),
        });

        return store;
    },
    // useShow: (store) => {
    //     if (!store.isApiInitFetched) return <ViewLoadingMask />;
    // },
});

export const hocProfileChangePassword = storeUtil.hocComp;
export const useProfileChangePasswordStore = storeUtil.useStore;
