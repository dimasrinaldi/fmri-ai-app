import { useEffect } from "react";
import { trpcUse } from "~/trpc/trpc.fetch";
import { useCraftStore } from "~/use/use.craft-store";
import { useMobState } from "~/use/use.mob-state";
import { useToMobExt } from "~/use/use.to-mob-ext";
import { utilCreateWidget } from "~/util/util.create-widget";
import { utilOmit } from "~/util/util.omit";
import { utilToPivotWithPercent } from "~/util/util.to-pivot-with-percent";
import { dataColFilter, getDataColFilter, TColFilterId } from "./data.col-filter";
import { useSurveyIdFilterStore } from "../_app.survey.$id._filter/store";
import { useAppStore } from "../_app/store";
import { TPivotTypeId } from "./data.pivot-type";
import { utilToPivot } from "~/util/util.to-pivot";

const storeUtil = utilCreateWidget({
    name: "SurveyIdPivotTable",
    useInitStore: (opt) => {
        const app = useAppStore()
        const surveyIdFilter = useSurveyIdFilterStore()
        const state = opt.useMobState(() => ({
            selectedCol: "" as TColFilterId,
            selectedRow: "" as TColFilterId,
            pivotType: "percent" as TPivotTypeId
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
                    ...surveyIdFilter.apiQuery,
                    selectedCol: store.selectedCol,
                    selectedRow: store.selectedRow,
                    isScore: store.pivotType == "score",
                };
                return result
            },
            get items() { return ext.stat.data.items },
            get totalPerson() { return ext.stat.data.totalPerson },
            get pivotItems() {
                const pivotPerson = utilToPivotWithPercent(store.items, "row", "col", "personCount", store.totalPerson);
                const pivotScore = utilToPivot(store.items, "row", "col", "avgScore");
                return { byPerson: pivotPerson, byScore: pivotScore };
            },
            get displayedPivotItems() {
                const pivotItems = store.pivotType == "number" ? store.pivotItems.byPerson.raw :
                    store.pivotType == "percent" ? store.pivotItems.byPerson.string : store.pivotItems.byScore;
                // const pivotItems = store.pivotType == "number" ? store.pivotItems.raw : store.pivotItems.string;
                return pivotItems.map((i, ix) => ({ ...i, id: ix }));
            },
            get tableColOptions() {
                return Object.keys(store.displayedPivotItems[0] ?? {}).map(i => ({
                    title: i == "name" ? `${getDataColFilter(store.selectedRow).label} / ${getDataColFilter(store.selectedCol).label}` : i,
                    dataIndex: i
                })).filter(i => !["id", "total"].includes(i.dataIndex));
            },
            get aiData() {
                const data = store.displayedPivotItems.map(i => {
                    const { id, total, ...rest } = i;
                    return rest
                })
                const result = {
                    title: `Pivot table for row:${store.selectedRow} and column:${store.selectedCol} with total respondens:${store.totalPerson}`,
                    active: data.length > 0,
                    data,
                };
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
        }), () => [
            utilOmit(state, "setState"),
        ]);

        const ext = useToMobExt({
            stat: trpcUse.surveyIdPivotTableStat.useQuery(store.apiQuery, {
                initialData: {
                    items: [],
                    totalPerson: 0
                },
                enabled: store.enabledApiFetch
            }),
        })

        useEffect(() => {
            app.addAiData("SurveyIdPivotTable", store.aiData);
        }, [store.aiData])

        return store;
    },

});

export const hocSurveyIdPivotTable = storeUtil.hocComp;
export const useSurveyIdPivotTableStore = storeUtil.useStore;
