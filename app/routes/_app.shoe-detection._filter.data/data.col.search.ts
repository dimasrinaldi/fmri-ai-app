import { dataColFilter as _dataColFilter } from "../_app.shoe-detection._filter/data.col-filter";
const _data = [
  { id: "id", label: "ID" },
  ..._dataColFilter
] as const;

export type TColSearchId = (typeof _data)[number]["id"];
export type TColSearch = {
  id: TColSearchId;
};
export const dataColSearch: TColSearch[] = _data as any;
export const getDataColSearch = (id: TColSearchId): TColSearch => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};
