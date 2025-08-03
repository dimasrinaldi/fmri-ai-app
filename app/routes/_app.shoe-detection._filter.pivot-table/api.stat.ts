import promiseAllProperties from "promise-all-properties";
import { z } from "zod";
import { db } from "~/db/db.app";
import { utilSqlFilter } from "~/routes/_app.shoe-detection._filter/util.sql-filter";
import { SchemaApiFilter } from "~/routes/_app/schema.api-filter";
import { trpcProcedure } from "~/trpc/trpc.app";
import { TColFilterId } from "../_app.shoe-detection._filter/data.col-filter";

export const apiStat = trpcProcedure
  .input(SchemaApiFilter.extend({
    selectedCol: z.custom<TColFilterId>(),
    selectedRow: z.custom<TColFilterId>(),
  }))
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const mainSql = utilSqlFilter(input).as("main");
    const itemsSql = db.selectFrom(mainSql).select(({ fn, ref }) => [
      ref(input.selectedCol).as("col"),
      ref(input.selectedRow).as("row"),
      fn.count<number>("id").as("countId"),
    ])
      .groupBy(["col", "row"])
      .orderBy("countId", "desc")
      .execute();

    const totalPersonSql = db.selectFrom(mainSql)
      .select(({ fn }) => fn.countAll<number>().as("val"))
      .executeTakeFirst();

    let { items, totalCount: totalItems } = await promiseAllProperties({
      items: itemsSql,
      totalCount: totalPersonSql
    })

    return {
      items,
      totalItems: totalItems?.val ?? 0
    };
  });
