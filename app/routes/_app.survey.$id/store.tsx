import { isValid } from "ulidx";
import { useQurlStore } from "~/provider/provider.qurl";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobState } from "~/use/use.mob-state";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";

const storeUtil = utilCreateWidget({
    name: "SurveyId",
    useInitStore: () => {
        const qurl = useQurlStore();
        const state = useMobState(() => ({
        }))

        const store = useCraftStore(() => ({
            get surveyId() { return qurl.pathVal(1, "") },
            get surveyTitle() { return ext.one.data.items[0]?.title ?? "" },
            get respondentType() { return ext.one.data.items[0]?.respondentType ?? "Real" },
            get isLoadingOne() { return !ext.one.isFetched },
            get isShowContent() {
                return isValid(store.surveyId) && store.surveyTitle.length > 0
            },
            get qurl() { return qurl }
        }), () => [
            utilOmit(state, "setState"),
        ]);
        const ext = useToMobExt({
            one: trpcUse.surveyIdOne.useQuery({
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

export const hocSurveyId = storeUtil.hocComp;
export const useSurveyIdStore = storeUtil.useStore;
