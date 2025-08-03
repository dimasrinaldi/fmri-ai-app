import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import dayjs from "moment";
import pg from "pg";
import { configServer } from "~/config/config.server";
import { DbClientTable } from "./db.client";
import { DbFileTable } from "./db.file";
import { DbRespondentTable } from "./db.respondent";
import { DbRoleTable } from "./db.role";
import { DbShoeDetectionTable } from "./db.shoe-detection";
import { DbSurveyTable } from "./db.survey";
import { DbSurveyDataTable } from "./db.survey-data";
import { DbUserTable } from "./db.user";

interface Database {
  client: DbClientTable;
  role: DbRoleTable;
  user: DbUserTable;
  survey: DbSurveyTable
  surveyData: DbSurveyDataTable;
  respondent: DbRespondentTable;
  shoeDetection: DbShoeDetectionTable;
  file: DbFileTable
}

const { Pool, types } = pg;

const dbRaw = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: configServer.dbHost,
      port: configServer.dbPort,
      user: configServer.dbUser,
      password: configServer.dbPass,
      database: configServer.dbName,
      max: 10,
    }),
  }),
  plugins: [
    new CamelCasePlugin(),
  ],
  log(event) {
    if (process.env.NODE_ENV == "development" && event.level === "query") {
      // console.log(event.query.sql);
      // console.log(event.query.parameters);
    }
  },
});

types.setTypeParser(types.builtins.INT8, (value: string) => parseInt(value));
types.setTypeParser(types.builtins.FLOAT8, (value: string) => parseFloat(value));
types.setTypeParser(types.builtins.NUMERIC, (value: string) => parseFloat(value));
types.setTypeParser(types.builtins.TIMESTAMPTZ, (value: string) => dayjs(value).format());

export const db = dbRaw; //.withSchema(configServer.dbSchema);
