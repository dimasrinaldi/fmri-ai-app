import _ from "lodash";
import { useEffect } from "react";
import { useSurveyIdFilterStore } from "~/routes/_app.survey.$id._filter/store";
import { useAppStore } from "~/routes/_app/store";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobState } from "~/use/use.mob-state";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";

const storeUtil = utilCreateWidget({
    name: "SurveyIdBrandAwernessViewTom",
    useInitStore: () => {
        const app = useAppStore();
        const surveyFilter = useSurveyIdFilterStore();

        const store = useCraftStore(() => ({
            get titleSub() {
                return {
                    title: "TOM",
                    sub: "(top of mind) in percent of respondents"
                }
            },
            get apiQuery() { return surveyFilter.apiQuery },
            get items() { return ext.stat.data.items },
            get totalPerson() { return ext.stat.data.totalPerson },
            get pivotData() {
                const number = store.items.map(i => ({ ...i, personCount: Math.round(i.personCount / store.totalPerson * 100) }));
                const string = number.map(i => ({ ...i, personCount: i.personCount + "%" }));
                return { number, string }
            },
            get echartData() {
                const myItems = _.cloneDeep(store.pivotData.number);
                const categories = myItems.map((i) => i.category);
                const dataSeries = myItems.map((i) => i.personCount)
                return { categories, dataSeries }
            }, get aiData() {
                const data = store.pivotData.string;
                const result = {
                    title: `${store.titleSub.title} ${store.titleSub.sub}`,
                    active: data.length > 0,
                    data,
                };
                return result;
            },
            get isLoading() { return !ext.stat.isFetched },
            get isApiInitFetched() { return ext.isApiInitFetched },
        }));

        const ext = useToMobExt({
            stat: trpcUse.surveyIdBrandAwarenessViewTomStat.useQuery(store.apiQuery, {
                initialData: {
                    items: [],
                    totalPerson: 0
                }
            }),
        })

        useEffect(() => {
            app.addAiData("surveyBrandTom", store.aiData);
        }, [store.aiData])

        return store;
    },

});

export const hocViewTom = storeUtil.hocComp;
export const useViewTomStore = storeUtil.useStore;
