import _ from "lodash";
import { useEffect } from "react";
import { useSurveyIdFilterStore } from "~/routes/_app.survey.$id._filter/store";
import { useAppStore } from "~/routes/_app/store";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilToPivotWithPercent } from "~/util/util.to-pivot-with-percent";

const storeUtil = utilCreateWidget({
    name: "SurveyIdBrandAwernessViewAwareness",
    useInitStore: () => {
        const app = useAppStore();
        const surveyFilter = useSurveyIdFilterStore();

        const store = useCraftStore(() => ({
            get titleSub() {
                return {
                    title: "SPONT",
                    sub: "(spontaneous) in percent of total respondents"
                }
            },
            get apiQuery() { return surveyFilter.apiQuery },
            get items() { return ext.stat.data.items },
            get totalCount() { return ext.stat.data.totalCount },
            get pivotItems() { return utilToPivotWithPercent(store.items, "category", "stack", "val", store.totalCount) },
            get echartData() {
                const pivotPercData = store.pivotItems.number;
                const categories = pivotPercData.map((i) => i.name);
                const stackNames = Object.keys(_.omit(pivotPercData[0] ?? {}, ["name", "total"]));
                const dataSeries = stackNames.map((i) => {
                    return {
                        name: i,
                        type: 'bar',
                        stack: 'total',
                        label: {
                            show: true,
                            formatter: (params: { value: number }) => Math.round(params.value) + ' %'
                        },
                        data: categories.map(catName => {
                            const val = parseInt((pivotPercData.find(ii => ii.name == catName)?.[i] ?? "0").toString());
                            return val
                        })
                    }
                })
                return { categories, dataSeries }
            }, get isLoading() { return !ext.stat.isFetched },
            get isApiInitFetched() { return ext.isApiInitFetched },
            get aiData() {
                const data = store.pivotItems.string.map(i => {
                    const { total, ...rest } = i;
                    return rest;
                })
                const result = {
                    title: `${store.titleSub.title} ${store.titleSub.sub}`,
                    active: data.length > 0,
                    data,
                };
                return result;
            },
        }));

        const ext = useToMobExt({
            stat: trpcUse.surveyIdBrandAwarenessViewAwarenessStat.useQuery(store.apiQuery, {
                initialData: {
                    items: [],
                    totalCount: 0
                }
            }),
        })

        useEffect(() => {
            app.addAiData("surveyBrandAwareness", store.aiData);
        }, [store.aiData])

        return store;
    },

});

export const hocViewAwareness = storeUtil.hocComp;
export const useViewAwarenessStore = storeUtil.useStore;
