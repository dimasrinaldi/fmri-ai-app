import { dataApp } from "./data.app";

const _data = [
  { id: "Common" },
  ...dataApp
] as const;

export type TAppSystemId = (typeof _data)[number]["id"];
export type TAppSystem = {
  id: TAppSystemId;
};
export const dataAppSystem: TAppSystem[] = _data as any;
export const getDataAppSystem = (id: TAppSystemId): TAppSystem => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};


