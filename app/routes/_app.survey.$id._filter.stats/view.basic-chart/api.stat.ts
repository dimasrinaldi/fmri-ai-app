import promiseAllProperties from "promise-all-properties";
import { z } from "zod";
import { db } from "~/db/db.app";
import { TColFilterId } from "~/routes/_app.survey.$id._filter/data.col-filter";
import { SchemaApiFilter } from "~/routes/_app.survey.$id._filter/schema.api-filter";
import { utilSqlSurveyFilter } from "~/routes/_app.survey.$id._filter/util.sql-filter";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiStat = trpcProcedure
  .input(SchemaApiFilter.extend({
    groupBy: z.custom<TColFilterId>(),
    limit: z.number().default(10),
  }))
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const mainSql = utilSqlSurveyFilter(input).as("main");
    const itemsSql = db.selectFrom(mainSql).select(({ fn }) => [
      `${input.groupBy} as category`,
      fn.count<number>('personName').distinct().as("itemCount")
    ])
      .groupBy(input.groupBy)
      .orderBy("itemCount", "desc")
      .limit(input.limit)
      .execute();

    const totalCount = db.selectFrom(mainSql)
      .select(({ fn }) => fn.count<number>("id").distinct().as("val"))
      .executeTakeFirst();

    const { items, totalCount: totPersonRaw } = await promiseAllProperties({
      items: itemsSql,
      totalCount: totalCount
    })
    return { items, totalPerson: totPersonRaw?.val ?? 0 };
  });
