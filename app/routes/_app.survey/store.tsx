import { useAuthStore } from "~/root/auth/store";
import { useCraftStore } from "~/use/use.craft-store";
import { utilCreateWidget } from "~/util/util.create-widget";
import { useAppStore } from "../_app/store";
import { useQurlStore } from "~/provider/provider.qurl";
import { isValid } from "ulidx";

const storeUtil = utilCreateWidget({
    name: "Survey",
    useInitStore: () => {
        const auth = useAuthStore();
        const qurl = useQurlStore();
        const store = useCraftStore(() => ({
            get surveyId() { return qurl.pathVal(1, "") },
            get isExistSurveyId() { return isValid(this.surveyId) },
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

export const hocSurvey = storeUtil.hocComp;
export const useSurveyStore = storeUtil.useStore;
