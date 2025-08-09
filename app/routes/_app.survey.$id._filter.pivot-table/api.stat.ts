import promiseAllProperties from "promise-all-properties";
import { z } from "zod";
import { db } from "~/db/db.app";
import { SchemaApiFilter } from "~/routes/_app.survey.$id._filter/schema.api-filter";
import { utilSqlSurveyFilter } from "~/routes/_app.survey.$id._filter/util.sql-filter";
import { trpcProcedure } from "~/trpc/trpc.app";
import { TColFilterId } from "./data.col-filter";
import _ from "lodash";

export const apiStat = trpcProcedure
  .input(SchemaApiFilter.extend({
    selectedCol: z.custom<TColFilterId>(),
    selectedRow: z.custom<TColFilterId>(),
    isScore: z.boolean(),
  }))
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const mainSql = utilSqlSurveyFilter(input).as("main");
    const itemsSql = db.selectFrom(mainSql).select(({ fn, ref }) => [
      ref(input.selectedCol).as("col"),
      ref(input.selectedRow).as("row"),
      fn.count<number>('personName').distinct().as("personCount"),
      fn.avg<number>("answerScore").as("avgScore"),
    ])
      .$if(input.isScore, (qb) => qb.where("answerScore", ">", 0))
      .groupBy(["col", "row"])
      .orderBy("personCount", "desc")
      .execute();

    const totalPersonSql = db.selectFrom(mainSql)
      .select(({ fn }) => fn.count<number>("personName").distinct().as("val"))
      .executeTakeFirst();

    let { items, totalCount: totPersonRaw } = await promiseAllProperties({
      items: itemsSql,
      totalCount: totalPersonSql
    })

    const personNames = items.map(i => i.row);
    if (input.selectedRow === "personName" && personNames.length > 0) {
      const respondents = await db.selectFrom('respondent')
        .select(["id", "gender", "age", "city", "occupation"])
        .where("id", "in", personNames)
        .execute();
      items = items.map((i, ikey) => {
        const myPerson = respondents.find(r => r.id === i.row);
        if (myPerson) {
          i.row = `${myPerson.gender} ${myPerson.age}th ${myPerson.city} ${myPerson.occupation} | ${i.row}`;
        }
        return i;
      })
    }
    return {
      items: items.map(i => ({ ...i, avgScore: _.round(i.avgScore, 2) })),
      totalPerson: totPersonRaw?.val ?? 0
    };
  });
