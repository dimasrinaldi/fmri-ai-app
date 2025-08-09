import promiseAllProperties from "promise-all-properties";
import { db } from "~/db/db.app";
import { SchemaApiFilter } from "~/routes/_app.survey.$id._filter/schema.api-filter";
import { utilSqlSurveyFilter } from "~/routes/_app.survey.$id._filter/util.sql-filter";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiStat = trpcProcedure
  .input(SchemaApiFilter)
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const mainSql = utilSqlSurveyFilter(input).as("main");
    const itemsSql = db.selectFrom(mainSql).select(({ fn }) => [
      "answerCategory as category",
      fn.count<number>('personName').distinct().as("personCount")
    ])
      .groupBy("answerCategory")
      .orderBy("personCount", "desc")
      .execute();

    const totalPersonSql = db.selectFrom(mainSql)
      .select(({ fn }) => fn.count<number>("personName").distinct().as("val"))
      .executeTakeFirst();

    const { items, totalCount: totPersonRaw } = await promiseAllProperties({
      items: itemsSql,
      totalCount: totalPersonSql
    })
    return { items, totalPerson: totPersonRaw?.val ?? 0 };
  });
