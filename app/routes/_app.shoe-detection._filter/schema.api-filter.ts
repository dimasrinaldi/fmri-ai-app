import { z } from "zod";
import { SchemaApiFilter as MySchema } from "../_app/schema.api-filter";

export const SchemaApiFilter = MySchema

export type TInputApiFilter = z.input<typeof SchemaApiFilter>;
export type TFilterCol = z.infer<typeof SchemaApiFilter>["filter"][number];