import _ from "lodash";
import moment from "moment";
import { dataCatMinuteKm } from "~/data/data.cat-minute-km";
import { dataRunningDistance } from "~/data/data.running-distance";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilDownloadCsv } from "~/util/util.download-csv";
import { utilOmit } from "~/util/util.omit";
import { utilToPivotWithPercent } from "~/util/util.to-pivot-with-percent";
import { dataColFilter, getDataColFilter, TColFilterId } from "../_app.shoe-detection._filter/data.col-filter";
import { useShoeDetectionFilterStore } from "../_app.shoe-detection._filter/store";
import { useAppStore } from "../_app/store";
import { TPivotTypeId } from "./data.pivot-type";


const storeUtil = utilCreateWidget({
    name: "ShoeDetectionPivotTable",
    useInitStore: (opt) => {
        const app = useAppStore()
        const filterStore = useShoeDetectionFilterStore();
        const state = opt.useMobState(() => ({
            selectedCol: "" as TColFilterId,
            selectedRow: "" as TColFilterId,
            pivotType: "percent" as TPivotTypeId,
        }));

        const store = useCraftStore(() => ({
            get typeOptions() {
                return dataColFilter.map(i => ({
                    ...i,
                    value: i.id,
                }))
            },
            get apiQuery() {
                let result = {
                    clientIds: [app.activeClient.id],
                    ...filterStore.apiQuery,
                    selectedCol: store.selectedCol,
                    selectedRow: store.selectedRow,
                };
                return result
            },
            get items() { return ext.stat.data.items },
            get totalItems() { return ext.stat.data.totalItems },
            get pivotItems() {
                const result = utilToPivotWithPercent(store.items, "row", "col", "countId", store.totalItems);
                return { byId: result };
            },
            get displayedPivotItems() {
                const pivotItems = store.pivotType == "number" ? store.pivotItems.byId.raw
                    : store.pivotType == "percent" ? store.pivotItems.byId.string : store.pivotItems.byId.stringByColumn
                return pivotItems.map((i, ix) => ({ ...i, id: ix }));
            },
            get tableColOptions() {
                let result = Object.keys(store.displayedPivotItems[0] ?? {}).map(i => ({
                    title: i,
                    dataIndex: i,
                    fixed: undefined as any
                })).filter(i => !["id", "name", "total"].includes(i.dataIndex));

                if (store.selectedCol == "distance") {
                    const tempResult = _.cloneDeep(result);
                    const distanceIndex = _.uniq(tempResult.map(i => i.dataIndex));
                    result = dataRunningDistance
                        .filter(i => distanceIndex.includes(i.id))
                        .map(i => {
                            return tempResult.find(j => j.dataIndex == i.id) ?? tempResult[0];
                        });
                } else if (store.selectedCol == "minuteKm") {
                    const tempResult = _.cloneDeep(result);
                    result = _.orderBy(tempResult, i => i.dataIndex, "asc")
                }
                result = [{
                    title: "No",
                    dataIndex: "row",
                    fixed: "left",
                }, {
                    title: store.selectedRow.length == 0 ? "Name" : `${getDataColFilter(store.selectedRow).label} / ${getDataColFilter(store.selectedCol).label}`,
                    dataIndex: "name",
                    fixed: "left",
                }, {
                    title: "TOTAL",
                    dataIndex: "total",
                    fixed: undefined,
                }, ...result];
                return result;
            },
            get isLoading() { return store.enabledApiFetch && !ext.stat.isFetched },
            get isApiInitFetched() { return ext.isApiInitFetched },
            get enabledApiFetch() { return store.selectedCol.length > 0 && store.selectedRow.length > 0 },
            onSelectCol(col: TColFilterId) {
                state.setState({ selectedCol: col })
            },
            onSelectRow(row: TColFilterId) {
                state.setState({ selectedRow: row })
            },
            onSetPivotType(pivotType: TPivotTypeId) {
                state.setState({ pivotType })
            },
            onDownloadData() {
                const myItems = _.cloneDeep(store.displayedPivotItems).map(i => {
                    return _.omit(i, ["id", "total"])
                })
                if (myItems.length < 0) return;
                const date = moment().format("YYYY-MM-DDTHH-mm-ss");
                const clientName = app.activeClient.name;
                const filename = `${clientName}-shoe-detection-pivot-${date}.csv`
                utilDownloadCsv(myItems, filename);
            }
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            stat: trpcUse.shoeDetectionPivotTableStats.useQuery(store.apiQuery, {
                initialData: {
                    items: [],
                    totalItems: 0
                },
                enabled: store.enabledApiFetch
            }),
        })

        return store;
    },

});

export const hocShoeDetectionPivotTable = storeUtil.hocComp;
export const useShoeDetectionPivotTableStore = storeUtil.useStore;
