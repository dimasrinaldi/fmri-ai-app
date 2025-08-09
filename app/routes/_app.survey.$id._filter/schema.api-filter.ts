import { z } from "zod";

export const SchemaApiFilter = z.object({
    surveyIds: z.array(z.string()).default([]),
    filter: z.array(z.object({
        col: z.string(),
        vals: z.array(z.string()).default([])
    })).default([])
});

export type TInputApiFilter = z.input<typeof SchemaApiFilter>;
export type TFilterCol = z.infer<typeof SchemaApiFilter>["filter"][number];