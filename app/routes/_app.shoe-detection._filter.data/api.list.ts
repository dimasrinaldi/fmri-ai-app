import promiseAllProperties from "promise-all-properties";
import { db } from "~/db/db.app";
import { SchemaInputApiBase } from "~/schema";
import { trpcProcedure } from "~/trpc/trpc.app";
import { utilFilePath } from "~/util/util.file-path";
import { utilFilePathUrl } from "~/util/util.file-path-url";
import { utilSqlFilter } from "../_app.shoe-detection._filter/util.sql-filter";
import { SchemaApiFilter } from "../_app/schema.api-filter";
import { dataColSearch } from "./data.col.search";


export const apiList = trpcProcedure
  .input(SchemaInputApiBase.merge(SchemaApiFilter).extend({}))
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });

    const sqlMain = () => {
      const searchIn = [...dataColSearch.map((i) => i.id), "runningNum"];
      const mainSql = utilSqlFilter(input).as("main");
      const itemsFiltered = db
        .selectFrom(mainSql)
        .selectAll()
        .where((eb) => {
          const orSearch = searchIn.map((i) => eb(i as any, "ilike", `%${input.search.toLowerCase()}%`));
          return eb.or(orSearch);
        })
        .where("clientId", "in", input.clientIds);

      return db.with("main", () => itemsFiltered).selectFrom("main");
    };

    const sqlItems = sqlMain()
      .leftJoin("user", "user.id", "main.updatedById")
      .select([
        "main.id",
        "main.brand",
        "main.model",
        "main.color",
        "main.gender",
        "main.imageName",
        "main.podium",
        "main.distance",
        "main.event",
        "main.minuteKm",
        "main.updatedAt",
        "main.dataStatus",
        "main.runningNum",
        "user.name as updatedBy",
      ])
      .orderBy(input.sortBy as any, input.sortDirection)
      .orderBy("id", "desc")
      .limit(input.limit)
      .offset(input.offset)
      .execute();

    const sqlCount = sqlMain()
      .select(({ fn }) => [fn.countAll<number>().as("count")])
      .executeTakeFirst();

    const result = await promiseAllProperties({
      items: sqlItems,
      count: sqlCount,
    });

    return {
      items: result.items.map(i => ({
        ...i,
        imageUrl: utilFilePathUrl("shoe-detection", i.imageName),
        thumbnail: `/thumbnail/${utilFilePath("shoe-detection", i.imageName)}?h=100`
      })),
      count: result.count?.count ?? 0,
    };
  });
