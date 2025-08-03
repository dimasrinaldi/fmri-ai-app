import promiseAllProperties from "promise-all-properties";
import { z } from "zod";
import { db } from "~/db/db.app";
import { TColFilterId } from "../data.col-filter";
import { utilSqlFilter } from "~/routes/_app.shoe-detection._filter/util.sql-filter";
import { SchemaApiFilter } from "~/routes/_app/schema.api-filter";
import { trpcProcedure } from "~/trpc/trpc.app";
import { sql } from "kysely";

export const apiTotal = trpcProcedure
  .input(SchemaApiFilter.extend({
    groupBy: z.string()
  }))
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const mainSql = utilSqlFilter(input).as("main");
    const data = await db.selectFrom(mainSql).select(({ fn }) => [
      fn.count<number>(input.groupBy as TColFilterId).distinct().as("itemCount"),
    ])
      .executeTakeFirst();
    return { total: data?.itemCount ?? 0 };
  });
