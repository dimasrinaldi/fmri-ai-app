import { Insertable, Selectable, Updateable } from "kysely";
import { TItemStatusId } from "~/data/data.item-status";
import { TRespondentTypeId } from "~/data/data.respondent-type";

export interface DbSurveyTable {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: TItemStatusId;
  createdAt: string;
  createdById: string;
  updatedAt: string;
  updatedById: string;
  questionnaire: string;
  respondentType: TRespondentTypeId
  toStatsNote: string;
}
export type DbSurvey = Selectable<DbSurveyTable>;
export type DbNewClient = Insertable<DbSurveyTable>;
export type DbSurveyUpdate = Updateable<DbSurveyTable>;
