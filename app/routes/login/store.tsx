import { useQurlStore } from "~/provider/provider.qurl";
import { useAuthStore } from "~/root/auth/store";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobState } from "~/use/use.mob-state";
import usePublicEnv from "~/use/use.publicEnv";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";
import { utilZodErrFromStr } from "~/util/util.zod-err-from-str";

const storeUtil = utilCreateWidget({
    name: "Login",
    useInitStore: () => {
        const qurl = useQurlStore();
        const auth = useAuthStore();
        const trpcUtils = trpcUse.useUtils();
        const env = usePublicEnv()
        const state = useMobState(() => ({
            username: "",
            password: "",
            formErrStr: "",
        }));

        const store = useCraftStore(() => ({
            get isAuth() {
                return auth.isAuthorized
            },
            setState(arg: Partial<Omit<typeof state, "setState">>) {
                state.setState(arg);
            },
            get formErr() {
                return utilZodErrFromStr(store.formErrStr, [
                    "username",
                    "password",
                    "invalidLogin",
                ]);
            },
            get isSubmitLoading() { return ext.login.isPending },
            onSubmit() {
                if (store.isAuth) {
                    qurl.set({ path: env.authHomePath });
                    return;
                }
                ext.login.mutate({
                    username: store.username,
                    password: store.password,
                });
            },
            onToHome() {
                qurl.set({ path: "/home" });
            },
            onToIndex() {
                qurl.set({ path: "/" });
            },
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            login: trpcUse.login.useMutation({
                onSuccess: () => {
                    trpcUtils.authProfile.refetch().then(() => {
                        const path = env.authHomePath;
                        qurl.set({ path });
                    });
                },
                onError: ({ message }) => {
                    store.setState({
                        password: "",
                        formErrStr: message,
                    });
                },
            }),
        });

        return store;
    },
});

export const hocLogin = storeUtil.hocComp;
export const useLoginStore = storeUtil.useStore;
