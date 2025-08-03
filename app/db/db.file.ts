import { Insertable, Selectable, Updateable } from "kysely";

export interface DbFileTable {
  id: string;
  tag: string;
  name: string;
  updatedAt: string;
  base64: string;
  mimeType: string;
}
export type DbFile = Selectable<DbFileTable>;
export type DbNewFile = Insertable<DbFileTable>;
export type DbFileUpdate = Updateable<DbFileTable>;
