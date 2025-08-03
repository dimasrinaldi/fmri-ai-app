// level tiap role
const _data = [
  { id: "Super" },
  { id: "Client" },
] as const;

export type TRoleLevelId = (typeof _data)[number]["id"];
export type TRoleLevel = {
  id: TRoleLevelId;
};
export const dataRoleLevel: TRoleLevel[] = _data as any;
export const getDataRoleLevel = (id: TRoleLevelId): TRoleLevel => {
  return _data.find((i) => i.id == id) ?? ([_data[0]] as any);
};

