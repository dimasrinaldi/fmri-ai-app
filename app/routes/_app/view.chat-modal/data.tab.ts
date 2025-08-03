const _data = [
  { id: "chat", label: "Chat" },
  { id: "data", label: "Data" },
] as const;

export type TTabId = (typeof _data)[number]["id"];
export type TTab = {
  id: TTabId;
  label: string;
};
export const dataTab: TTab[] = _data as any;
export const getDataTab = (id: TTabId): TTab => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};
