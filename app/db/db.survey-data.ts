import { Insertable, Selectable, Updateable } from "kysely";

export interface DbSurveyDataTable {
  id: number;
  surveyTitle: string;
  personName: string;
  personAge: string;
  personCity: string;
  personGender: string;
  question: string;
  answerContent: string;
  answerCategory: string;
  answerSec: string;
  awareness: "tom" | "spont" | "aided";
  surveyId: string;
  respondentId?: string;
  answerScore: number;
}
export type DbSurveyData = Selectable<DbSurveyDataTable>;
export type DbNewSurveyData = Insertable<DbSurveyDataTable>;
export type DbSurveyDataUpdate = Updateable<DbSurveyDataTable>;

