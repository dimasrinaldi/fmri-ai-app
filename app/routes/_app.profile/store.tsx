import { useQurlStore } from "~/provider/provider.qurl";
import { useAuthStore } from "~/root/auth/store";
import { useCraftStore } from "~/use/use.craft-store";
import { utilCreateWidget } from "~/util/util.create-widget";

const storeUtil = utilCreateWidget({
    name: "DashboardProfile",
    useInitStore: () => {
        const authStore = useAuthStore();
        const qurl = useQurlStore()
        const store = useCraftStore(() => ({
            get profile() { return authStore.profile },
            onLogout() {
                authStore.onLogout();
            },
            onChangePassword() {
                qurl.set("/profile/change-password");
            },
        }));

        return store;
    },
});

export const hocDashboardProfile = storeUtil.hocComp;
export const useDashboardProfileStore = storeUtil.useStore;
