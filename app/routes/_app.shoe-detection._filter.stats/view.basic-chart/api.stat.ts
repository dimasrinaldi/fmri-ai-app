import promiseAllProperties from "promise-all-properties";
import { z } from "zod";
import { db } from "~/db/db.app";
import { TColFilterId } from "../data.col-filter";
import { utilSqlFilter } from "~/routes/_app.shoe-detection._filter/util.sql-filter";
import { SchemaApiFilter } from "~/routes/_app/schema.api-filter";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiStat = trpcProcedure
  .input(SchemaApiFilter.extend({
    groupBy: z.custom<TColFilterId>()
  }))
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const mainSql = utilSqlFilter(input).as("main");
    const itemsSql = db.selectFrom(mainSql).select(({ fn }) => [
      `${input.groupBy} as category`,
      fn.count<number>('id').as("itemCount")
    ])
      .groupBy(input.groupBy)
      .orderBy("itemCount", "desc")
      .execute();

    const totalCount = db.selectFrom(mainSql)
      .select(({ fn }) => fn.count<number>("id").distinct().as("val"))
      .executeTakeFirst();

    const { items, totalCount: totalItems } = await promiseAllProperties({
      items: itemsSql,
      totalCount: totalCount
    })
    return { items, totalItems: totalItems?.val ?? 0 };
  });
