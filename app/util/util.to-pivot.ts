import _ from "lodash";

export const utilToPivot = <T>(data: T[], row: keyof T, col: keyof T, valName: keyof T) => {
  const mydata = _.clone(data);
  const rowNames = _.uniq(mydata.map(i => i[row]));
  const colNames = _.uniq(mydata.map(i => i[col]));

  type TPivotData = Record<string, {
    name: string;
    [key: string]: string | number;
    total: number;
  }>
  let pivotDataMap: TPivotData = {};
  rowNames.forEach(i => {
    const rowKey = i as unknown as string;
    if (!pivotDataMap[rowKey]) {
      pivotDataMap[rowKey] = { name: rowKey, total: 0 };
    }
    let totalInRow = 0;
    colNames.forEach(j => {
      const valData = Number(mydata.find(ii => ii[row] == i && ii[col] == j)?.[valName] ?? 0);
      pivotDataMap[rowKey][j as unknown as string] = valData;
      totalInRow += valData;
    })
    pivotDataMap[rowKey]["total"] = totalInRow;
  })

  const pivotData = _.orderBy(Object.values(pivotDataMap), i => i.total, "desc");
  return pivotData;
};
