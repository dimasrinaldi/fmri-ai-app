import { useAuthStore } from "~/root/auth/store";
import { useCraftStore } from "~/use/use.craft-store";
import { utilCreateWidget } from "~/util/util.create-widget";
import { useAppStore } from "../_app/store";

const storeUtil = utilCreateWidget({
    name: "Admin",
    useInitStore: () => {
        const store = useCraftStore(() => ({
        }));
        return store;
    },
    useAuthCheckAccess() {
        return {
            accessState: useAuthStore().checkAccess(["Admin_View"]),
            forbiddenType: "Page"
        }
    },
});

export const hocAdmin = storeUtil.hocComp;
export const useAdminStore = storeUtil.useStore;
