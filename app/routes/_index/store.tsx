import { useQurlStore } from "~/provider/provider.qurl";
import { useAuthStore } from "~/root/auth/store";
import { useCraftStore } from "~/use/use.craft-store";
import usePublicEnv from "~/use/use.publicEnv";
import { utilCreateWidget } from "~/util/util.create-widget";

const storeUtil = utilCreateWidget({
    name: "Index",
    useInitStore: () => {
        const qurl = useQurlStore();
        const auth = useAuthStore();
        const env = usePublicEnv()
        const store = useCraftStore(() => ({
            onToLogin() {
                qurl.set({
                    path: auth.isAuthorized
                        ? env.authHomePath
                        : env.loginPath
                });
            },
        }));
        return store;
    },
});

export const hocIndex = storeUtil.hocComp;
export const useIndexStore = storeUtil.useStore;
