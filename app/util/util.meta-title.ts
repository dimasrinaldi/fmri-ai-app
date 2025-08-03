import { z } from "zod";
import { utilPublicEnv } from "./util.public-env";

export const utilMetaTitle = z
  .function()
  .args(
    z.object({
      title: z.string().default(""),
      appName: z.string().default(utilPublicEnv().appName),
    })
  )
  .implement((args) => {
    return args.title.length > 0 ? `${args.title} - ${args.appName}` : args.appName;
  });
