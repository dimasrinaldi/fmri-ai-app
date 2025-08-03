const _data = [
  { id: "asc" },
  { id: "desc" },
] as const;

export type TSortDirectionId = (typeof _data)[number]["id"];
export type TSortDirection = {
  id: TSortDirectionId;
};
export const dataSortDirection: TSortDirection[] = _data as any;
export const getDataSortDirection = (id: TSortDirectionId): TSortDirection => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};
