
const _data = [
  { id: "personName" },
  { id: "personAge" },
  { id: "personCity" },
  { id: "personGender" },
  { id: "question" },
  { id: "answerContent" },
  { id: "answerCategory" },
  { id: "answerSec" },
  { id: "awareness" }
] as const;

export type TColSearchId = (typeof _data)[number]["id"];
export type TColSearch = {
  id: TColSearchId;
  color: string;
};
export const dataColSearch: TColSearch[] = _data as any;
export const getDataColSearch = (id: TColSearchId): TColSearch => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};
