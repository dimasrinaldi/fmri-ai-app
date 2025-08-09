import _ from "lodash";
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
    const itemsSql = db.selectFrom(mainSql).select(({ fn, ref }) => [
      "answerCategory as category",
      "awareness as stack",
      fn.count<number>("personName").distinct().as("val")
    ])
      .groupBy(["answerCategory", "awareness"])
      .orderBy("val", "desc")
      .execute();

    const totalCountSql = db.selectFrom(mainSql)
      .select(({ fn }) => fn.count<number>("personName").distinct().as("totalCount"))
      .executeTakeFirst();

    const { items, totalCount: totPersonRaw } = await promiseAllProperties({
      items: itemsSql,
      totalCount: totalCountSql
    })

    return { items, totalCount: totPersonRaw?.totalCount ?? 0 };

  });
