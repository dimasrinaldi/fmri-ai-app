import _ from "lodash";
import md5 from "md5";
import { useEffect } from "react";
import { TColFilterId } from "../data.col-filter";
import { useShoeDetectionFilterStore } from "~/routes/_app.shoe-detection._filter/store";
import { useAppStore } from "~/routes/_app/store";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";

type TypeProps = {
    title: string;
    description: string;
    col: TColFilterId;
    chart: "bar" | "pie" | "table";
    height?: number;
}
const storeUtil = utilCreateWidget({
    name: "ShoeDetectionViewBasicChart",
    useInitStore: (__, _props: TypeProps) => {
        const props = useToMobExt(_props)
        const app = useAppStore();
        const filterStore = useShoeDetectionFilterStore();

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
                    clientIds: [app.activeClient.id],
                    groupBy: props.col,
                    ...filterStore.apiQuery
                }
            },
            get chartType() { return props.chart; },
            get items() {
                let result = ext.stat.data.items.map(i => ({ ...i, category: i.category }));
                if (props.col == "minuteKm") {
                    result = _.orderBy(result, i => i.category, "asc")
                }
                return result;
            },
            get itemsTable() {
                const maxCount = _.max(store.items.map(i => i.itemCount)) ?? 0;
                let result = store.items.map((i, ix) => ({
                    ...i, num: ix + 1,
                    perc: store.totalItems > 0 ? _.round(100 * i.itemCount / store.totalItems, 2) : 0,
                    percProgress: maxCount > 0 ? _.ceil(100 * i.itemCount / maxCount) : 0
                }));

                return result;
            },
            get totalItems() { return ext.stat.data.totalItems },
            get echartData() {
                const categories = store.items.map((i) => i.category);
                const dataSeries = store.items.map((i) => ({
                    name: i.category,
                    value: i.itemCount,
                    percent: Math.round(i.itemCount / store.totalItems * 100),
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
            stat: trpcUse.shoeDetectionStatsViewBasicStats.useQuery(store.apiQuery, {
                initialData: {
                    items: [],
                    totalItems: 0
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
