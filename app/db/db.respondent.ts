import { Insertable, Selectable, Updateable } from "kysely";

export interface DbRespondentTable {
  id: string;
  city: string;
  gender: string;
  age: number;
  occupation: string;
  maritalStatus: string;
  sec: string;
  surveyId: string;
  answer: string;
  updatedAt: string;
}
export type DbRespondent = Selectable<DbRespondentTable>;
export type DbNewRole = Insertable<DbRespondentTable>;
export type DbRespondentUpdate = Updateable<DbRespondentTable>;


