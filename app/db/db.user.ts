import { Insertable, Selectable, Updateable } from "kysely";
import { TItemStatusId } from "~/data/data.item-status";

export interface DbUserTable {
  id: string;
  name: string;
  username: string;
  password: string;
  clientId: string;
  roleId: string;
  status: TItemStatusId;
  createdAt: string;
  createdById: string;
  updatedAt: string;
  updatedById: string;
}
export type DbUser = Selectable<DbUserTable>;
export type DbNewUser = Insertable<DbUserTable>;
export type DbUserUpdate = Updateable<DbUserTable>;
