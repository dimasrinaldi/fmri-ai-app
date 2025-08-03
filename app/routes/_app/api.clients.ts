import { openai } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import { z } from "zod";
import { db } from "~/db/db.app";
import { trpcProcedure } from "~/trpc/trpc.app";

export const apiClients = trpcProcedure
  .input(
    z.object({
      includeClientIds: z.array(z.string()),
    })
  )
  .query(async ({ input, ctx: { authUser } }) => {
    await authUser({ features: [] });
    const clients = await db.selectFrom("client").select([
      "id", "name", "apps"
    ])
      .where((qb) => qb.or([
        qb("id", "in", input.includeClientIds),
        qb("status", "=", "Active")
      ]))
      .limit(10000).execute();
    return { clients };
  });


