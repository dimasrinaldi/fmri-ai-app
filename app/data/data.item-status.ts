
const _data = [
  { id: "Active", color: "success" },
  { id: "Inactive", color: "error" },
] as const;

export type TItemStatusId = (typeof _data)[number]["id"];
export type TItemStatus = {
  id: TItemStatusId;
  color: string;
};
export const dataItemStatus: TItemStatus[] = _data as any;
export const getDataItemStatus = (id: TItemStatusId): TItemStatus => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};
