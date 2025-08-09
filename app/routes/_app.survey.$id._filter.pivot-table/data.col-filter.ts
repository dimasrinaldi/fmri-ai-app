import { dataColFilter as myDataColFilter } from "../_app.survey.$id._filter/data.col-filter"
const _data = [
  ...myDataColFilter,
  { id: "personName", label: "Person" },
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
