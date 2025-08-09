import _ from "lodash";
import md5 from "md5";
import { useEffect } from "react";
import { TColFilterId } from "~/routes/_app.survey.$id._filter/data.col-filter";
import { useSurveyIdFilterStore } from "~/routes/_app.survey.$id._filter/store";
import { useAppStore } from "~/routes/_app/store";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilTitleCase } from "~/util/util.title-case";

type TypeProps = {
    title: string;
    description: string;
    col: TColFilterId;
    chart: "bar" | "pie";
    height?: number;
}
const storeUtil = utilCreateWidget({
    name: "SurveyIdStatsViewBasicChart",
    useInitStore: (__, _props: TypeProps) => {
        const props = useToMobExt(_props)
        const app = useAppStore();
        const filterStore = useSurveyIdFilterStore();

        const store = useCraftStore(() => ({
            get height() { return props.height },
            get titleSub() {
                return {
                    title: props.title,
                    sub: props.description
                }
            },
            get apiQuery() {
                return {
                    groupBy: props.col,
                    ...filterStore.apiQuery
                }
            },
            get chartType() { return props.chart; },
            get items() { return ext.stat.data.items.map(i => ({ ...i, category: utilTitleCase(i.category) })) },
            get totalPerson() { return ext.stat.data.totalPerson },
            get echartData() {
                const categories = store.items.map((i) => i.category);
                const dataSeries = store.items.map((i) => ({
                    name: i.category,
                    value: i.itemCount,
                    percent: Math.round(i.itemCount / store.totalPerson * 100),
                }))
                return { categories, dataSeries }
            }, get aiData() {
                const data = _.cloneDeep(store.items);
                const result = {
                    title: `${store.titleSub.title} | ${store.titleSub.sub}`,
                    active: data.length > 0,
                    data,
                };
                return result;
            },
            get isLoading() { return !ext.stat.isFetched },
            get isApiInitFetched() { return ext.isApiInitFetched },
        }));

        const ext = useToMobExt({
            stat: trpcUse.surveyIdStatsViewBasicStats.useQuery(store.apiQuery, {
                initialData: {
                    items: [],
                    totalPerson: 0
                }
            }),
        })

        useEffect(() => {
            app.addAiData(`viewBasicChart_${md5(props.title)}`, store.aiData);
        }, [store.aiData])

        return store;
    },

});

export const hocViewBasicStats = storeUtil.hocComp;
export const useViewBasicStatsStore = storeUtil.useStore;
