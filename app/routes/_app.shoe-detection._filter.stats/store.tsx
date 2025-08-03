import { useAuthStore } from "~/root/auth/store";
import { useCraftStore } from "~/use/use.craft-store";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";

const storeUtil = utilCreateWidget({
    name: "ShoeDetectionStats",
    useInitStore: (opt) => {
        const auth = useAuthStore();
        const state = opt.useMobState(() => ({
            get access() {
                return {
                    featurePrivileged: auth.canAccess(["Feature_Privileged"])
                }
            }
        }));

        const store = useCraftStore(() => ({
        }), () => [
            utilOmit(state, "setState"),
        ]);

        return store;
    },

});

export const hocShoeDetectionStats = storeUtil.hocComp;
export const useShoeDetectionStatsStore = storeUtil.useStore;
