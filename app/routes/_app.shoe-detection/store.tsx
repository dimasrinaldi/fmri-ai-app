import { useAuthStore } from "~/root/auth/store";
import { useCraftStore } from "~/use/use.craft-store";
import { utilCreateWidget } from "~/util/util.create-widget";
import { useAppStore } from "../_app/store";

const storeUtil = utilCreateWidget({
    name: "ShoeDetection",
    useInitStore: () => {
        const auth = useAuthStore();
        const store = useCraftStore(() => ({
            get access() {
                return {
                    featurePrivileged: auth.canAccess(["Feature_Privileged"])
                }
            }
        }));
        return store;
    },
    useAuthCheckAccess: () => ({
        accessState: useAppStore().hasAppAccess(["BrandDetection"]) ? "Ok" : "Forbidden",
        forbiddenType: "Page"
    }),
});

export const hocShoeDetection = storeUtil.hocComp;
export const useShoeDetectionStore = storeUtil.useStore;
