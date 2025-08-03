import { Expression, RawBuilder, Simplify, sql } from "kysely"

export const utilDbFn = {
    jsonArrayFrom<O>(
        expr: Expression<O>
    ): RawBuilder<Simplify<O>[]> {
        return sql`(select coalesce(json_agg(agg), '[]') from ${expr} as agg)`
    },
    whereInJsonArrayText<O>(expr: Expression<O>) {
        return sql`(select * from jsonb_array_elements_text(${expr}))`
    }
}
