import { z } from "zod";
import { TSortDirectionId } from "./data/data.sort-direction";

export const SchemaInputApiBase = z.object({
  search: z.string().default(""),
  sortBy: z.string().default("id"),
  sortDirection: z.custom<TSortDirectionId>().default("desc"),
  limit: z.number().default(10),
  offset: z.number().default(0),
});

export const SchemaPasswordRequirements = {
  helper: "Min. 8 characters in length containing lower and upper case characters, numbers and symbols.",
  schema: {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    pointsPerUnique: 3,
    pointsPerRepeat: 1.5,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10,
  },
};
