import { dataColFilter as dtCol } from "../_app.shoe-detection._filter/data.col-filter"
const _data = [
  ...dtCol,
  { id: "runningNum", label: "BIB Number" },
] as const;

export type TColFilterId = (typeof _data)[number]["id"];
export type TColFilter = {
  id: TColFilterId;
  label: string;
};
export const dataColFilter: TColFilter[] = _data as any;
export const getDataColFilter = (id: TColFilterId): TColFilter => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};
