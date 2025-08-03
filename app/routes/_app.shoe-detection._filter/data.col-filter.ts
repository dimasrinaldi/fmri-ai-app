
const _data = [
  { id: "brand", label: "Brand" },
  { id: "model", label: "Model" },
  { id: "color", label: "Color" },
  { id: "gender", label: "Gender" },
  { id: "distance", label: "Distance" },
  { id: "event", label: "Event" },
  // { id: "podium", label: "Podium" },
  { id: "minuteKm", label: "Minute KM" },
  { id: "dataStatus", label: "Data Status" },
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
