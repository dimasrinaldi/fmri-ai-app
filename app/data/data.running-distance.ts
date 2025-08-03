//  daftar page dan fiturnya jika diperlukan access controlnya
const _data = [
  { id: "5K", label: "5K" },
  { id: "10K", label: "10K" },
  { id: "HM", label: "Half Marathon" },
  { id: "FM", label: "Full Marathon" },
] as const;

export type TRunningDistanceId = (typeof _data)[number]["id"];
export type TAcl = {
  id: TRunningDistanceId;
  label: string;
};
export const dataRunningDistance: readonly TAcl[] = _data as any;
export const getDataRunningDistance = (id: TRunningDistanceId): TAcl => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};

