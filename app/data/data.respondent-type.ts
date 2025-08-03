
const _data = [
  { id: "Real" },
  { id: "Synthetic" },
] as const;

export type TRespondentTypeId = (typeof _data)[number]["id"];
export type TRespondentType = {
  id: TRespondentTypeId;
  color: string;
};
export const dataRespondentType: TRespondentType[] = _data as any;
export const getDataRespondentType = (id: TRespondentTypeId): TRespondentType => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};
