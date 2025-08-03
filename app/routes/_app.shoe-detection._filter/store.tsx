import _ from "lodash";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";
import { utilTitleCase } from "~/util/util.title-case";
import { dataColFilter } from "./data.col-filter";
import { TFilterCol } from "./schema.api-filter";

const storeUtil = utilCreateWidget({
    name: "ShoeDetectionFilter",
    useInitStore: (opt) => {
        const state = opt.useMobState(() => ({
            selectedCol: "",
            filter: [] as TFilterCol[],
            filterValSearch: ""
        }));

        const store = useCraftStore(() => ({
            get filterFields() { return ext.filterFields.data.items },
            get isFilterLoading() { return !ext.filterFields.isFetched && store.selectedCol.length > 0 },
            get apiQuery() {
                const filter = {
                    // shoeDetectionEventId: [sdeStore.shoeDetectionEventId],
                    filter: store.filter
                }
                return filter;
            },
            get filterWithLabel() {
                const result = store.filter.map((i) => ({
                    label: dataColFilter.find(ii => ii.id == i.col)?.label ?? utilTitleCase(i.col),
                    ...i
                }));
                return result;
            },
            get selValDisabled() {
                return store.filterFields.length == 0 || store.isFilterLoading
            },
            get typeOptions() {
                return dataColFilter.map(i => ({
                    ...i,
                    value: i.id,
                })).filter(i => i.id != "dataStatus")
            },
            get typeValueOptions() {
                let result = store.filterFields.map(i => {
                    const checked = store.filter.find(ii => {
                        return ii.col == store.selectedCol && ii.vals.includes(i.name)
                    }) != undefined
                    return { value: i.name, checked }
                }).filter(i => i.value.toLowerCase().includes(store.filterValSearch.toLowerCase()))//.filter(i => !i.checked)
                result = _.orderBy(result, i => i.checked, "desc")
                return result;
            },
            onRemoveFilter(col: string, val: string) {
                let result = _.cloneDeep(store.filter).map(i => {
                    if (i.col == col) {
                        i.vals = i.vals.filter(ival => ival != val)
                    }
                    return i;
                }).filter(i => i.vals.length > 0);
                state.setState({ filter: result })
            }, onSelectFilterValSearch(val: string) {
                state.setState({ filterValSearch: val })
            },
            onSelectCol(col: string) {
                state.setState({
                    selectedCol: col,
                })
            }, onSelectVal(val: string) {
                let result = _.cloneDeep(store.filter);
                let itemIx = result.findIndex(i => i.col == store.selectedCol);
                if (itemIx == -1) {
                    result.push({ col: store.selectedCol, vals: [val] })
                } else {
                    if (result[itemIx].vals.includes(val)) {
                        result[itemIx].vals = result[itemIx].vals.filter(ival => ival != val);
                    } else {
                        result[itemIx].vals = _.uniq(_.concat(result[itemIx].vals, [val]));
                    }
                }
                result = result.filter(i => i.vals.length > 0);
                state.setState({ filter: result })
            }, onClearFilter() {
                state.setState({
                    filter: [],
                    selectedCol: ""
                })
            }
        }), () => ([
            utilOmit(state, "setState")
        ]));

        const ext = useToMobExt({
            filterFields: trpcUse.shoeDetectionFilterFields.useQuery({
                col: store.selectedCol
            }, {
                initialData: {
                    items: [],
                }, enabled: store.selectedCol.length > 0
            }),
        })
        return store;
    },
});

export const hocShoeDetectionFilter = storeUtil.hocComp;
export const useShoeDetectionFilterStore = storeUtil.useStore;
