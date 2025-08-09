
const _data = [
  { id: "personAge", label: "Age" },
  { id: "personCity", label: "City" },
  { id: "personGender", label: "Gender" },
  { id: "question", label: "Question" },
  { id: "answerContent", label: "Answer" },
  { id: "answerCategory", label: "Category" },
  { id: "answerSec", label: "Section" },
  { id: "awareness", label: "Awareness" },
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
