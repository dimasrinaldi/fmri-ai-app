import { useQurlStore } from "~/provider/provider.qurl";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { useSurveyIdStore } from "../_app.survey.$id/store";

const storeUtil = utilCreateWidget({
    name: "SurveyIdInfo",
    useInitStore: () => {
        const qurl = useQurlStore();
        const surveyId = useSurveyIdStore()

        const store = useCraftStore(() => ({
            get surveyId() { return surveyId.surveyId },
            get isLoadingOne() { return !ext.one.isFetched },
            get item() { return ext.one.data.items[0] },
        }));
        const ext = useToMobExt({
            one: trpcUse.surveyIdInfoOne.useQuery({
                id: store.surveyId
            }, {
                initialData: {
                    items: []
                },
            }),
        });
        return store;
    },

});

export const hocSurveyIdInfo = storeUtil.hocComp;
export const useSurveyIdInfoStore = storeUtil.useStore;
