import { Insertable, Selectable, Updateable } from "kysely";
import { TAppId } from "~/data/data.app";
import { TItemStatusId } from "~/data/data.item-status";

export interface DbClientTable {
  id: string;
  name: string;
  status: TItemStatusId;
  createdAt: string;
  createdById: string;
  updatedAt: string;
  updatedById: string;
  apps: TAppId[]
}
export type DbClient = Selectable<DbClientTable>;
export type DbNewClient = Insertable<DbClientTable>;
export type DbClientUpdate = Updateable<DbClientTable>;
