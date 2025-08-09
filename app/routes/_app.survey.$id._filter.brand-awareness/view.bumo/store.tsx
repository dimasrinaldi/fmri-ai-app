import { useEffect } from "react";
import { useSurveyIdFilterStore } from "~/routes/_app.survey.$id._filter/store";
import { useAppStore } from "~/routes/_app/store";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";

const storeUtil = utilCreateWidget({
    name: "SurveyIdBrandAwernessViewBomo",
    useInitStore: (__: any) => {
        const app = useAppStore();
        const surveyFilter = useSurveyIdFilterStore();

        const store = useCraftStore(() => ({
            get titleSub() {
                return {
                    title: "BUMO",
                    sub: "(brand used most often) in percent of respondents"
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
                const series = store.pivotData.number.map(i => ({ value: i.personCount, name: i.category }));
                return { series };
            },
            get aiData() {
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
            stat: trpcUse.surveyIdBrandAwarenessViewBumoStat.useQuery(store.apiQuery, {
                initialData: {
                    items: [],
                    totalPerson: 0
                }
            }),
        })

        useEffect(() => {
            app.addAiData("surveyBrandBumo", store.aiData);
        }, [store.aiData])

        return store;
    },

});

export const hocViewBomo = storeUtil.hocComp;
export const useViewBomoStore = storeUtil.useStore;
