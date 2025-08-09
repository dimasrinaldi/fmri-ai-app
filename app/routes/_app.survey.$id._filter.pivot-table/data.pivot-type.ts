
const _data = [
  { id: "number", label: "Number" },
  { id: "percent", label: "Percent" },
  { id: "score", label: "Score" },
] as const;

export type TPivotTypeId = (typeof _data)[number]["id"];
export type TPivotType = {
  id: TPivotTypeId;
  label: string;
};
export const dataPivotType: TPivotType[] = _data as any;
export const getDataPivotType = (id: TPivotTypeId): TPivotType => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};
