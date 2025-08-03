import _ from "lodash";
import { utilToPivot } from "./util.to-pivot";

export const utilToPivotWithPercent = <T>(data: T[], row: keyof T, col: keyof T, valName: keyof T, total: number) => {
  const pivotData = utilToPivot(data, row, col, valName);
  const getPivotData = (by: "column" | "grand") => {
    const pivotDataWithPercent = _.cloneDeep(pivotData).map(i => {
      // const thisTotal = by == "column" ? i.total : total;
      Object.keys(i).forEach(key => {
        if (typeof i[key] == "number") {
          let totalCol = 0;
          pivotData.forEach(j => {
            totalCol += parseInt(j[key].toString())
          })
          const thisTotal = by == "column" ? totalCol : total;
          i[key] = thisTotal == 0 ? 0 : Math.round(i[key] * 10000 / thisTotal) / 100;
        }
      })
      return i;
    })
    const pivotDataWithPercentStr = _.cloneDeep(pivotDataWithPercent).map(i => {
      Object.keys(i).forEach(key => {
        if (typeof i[key] == "number") {
          i[key] = i[key] + " %";
        }
      })
      return i;
    })
    return { pivotDataWithPercent, pivotDataWithPercentStr }
  }
  const byColumnTotal = getPivotData("column");
  const byGrandTotal = getPivotData("grand");

  return {
    raw: pivotData,
    number: byGrandTotal.pivotDataWithPercent,
    string: byGrandTotal.pivotDataWithPercentStr,
    numberByColumn: byColumnTotal.pivotDataWithPercent,
    stringByColumn: byColumnTotal.pivotDataWithPercentStr
  };
};