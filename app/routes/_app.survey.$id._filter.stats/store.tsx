import { useCraftStore } from "~/use/use.craft-store";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";

const storeUtil = utilCreateWidget({
    name: "SurveyIdStats",
    useInitStore: (opt) => {

        const state = opt.useMobState(() => ({
        }));

        const store = useCraftStore(() => ({
        }), () => [
            utilOmit(state, "setState"),
        ]);

        return store;
    },

});

export const hocSurveyIdStats = storeUtil.hocComp;
export const useSurveyIdStatsStore = storeUtil.useStore;
