import { db } from "~/db/db.app";
import { SchemaApiFilter, TInputApiFilter } from "./schema.api-filter";

export const utilSqlSurveyFilter = (filter: TInputApiFilter) => {

    const inputFilter = SchemaApiFilter.parse(filter);
    let dbMain = db.selectFrom("surveyData").selectAll();
    if (inputFilter.surveyIds.length > 0) {
        dbMain = dbMain.where("surveyId", "in", inputFilter.surveyIds)
    }
    inputFilter.filter.forEach(i => {
        const col = i.col;
        const vals = i.vals;
        if (vals.length == 0) return;
        dbMain = dbMain.where(col as any, "in", vals)
    })
    return dbMain;
}