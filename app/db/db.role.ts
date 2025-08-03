import { Insertable, Selectable, Updateable } from "kysely";
import { TAclId } from "~/data/data.acl";

export interface DbRoleTable {
  id: string;
  name: string;
  acl: TAclId[];
  updatedAt: string;
  updatedById: string;
}
export type DbRole = Selectable<DbRoleTable>;
export type DbNewRole = Insertable<DbRoleTable>;
export type DbRoleUpdate = Updateable<DbRoleTable>;
