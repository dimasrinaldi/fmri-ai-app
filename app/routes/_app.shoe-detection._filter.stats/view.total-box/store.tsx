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
    col: string;
}
const storeUtil = utilCreateWidget({
    name: "ShoeDetectionViewTotalBox",
    useInitStore: (__, _props: TypeProps) => {
        const props = useToMobExt(_props)
        const app = useAppStore();
        const filterStore = useShoeDetectionFilterStore();

        const store = useCraftStore(() => ({
            get col() { return props.col },
            get titleSub() {
                return {
                    title: props.title,
                    sub: props.description
                }
            },
            get totalItems() { return ext.stat.data.total },
            get apiQuery() {
                return {
                    clientIds: [app.activeClient.id],
                    groupBy: props.col,
                    ...filterStore.apiQuery
                }
            },
            get aiData() {
                const data = _.cloneDeep(store.totalItems);
                const result = {
                    title: `${store.titleSub.title} | ${store.titleSub.sub}`,
                    active: store.totalItems > 0,
                    data,
                };
                return result;
            },
            get isLoading() { return !ext.stat.isFetched },
            get isApiInitFetched() { return ext.isApiInitFetched },
        }));

        const ext = useToMobExt({
            stat: trpcUse.shoeDetectionStatsViewTotalBox.useQuery(store.apiQuery, {
                initialData: {
                    total: 0
                }
            }),
        })

        useEffect(() => {
            app.addAiData(`viewBasicChart_${md5(props.title)}`, store.aiData);
        }, [store.aiData])

        return store;
    },

});

export const hocViewTotalBox = storeUtil.hocComp;
export const useViewTotalBhocViewTotalBoxStore = storeUtil.useStore;
