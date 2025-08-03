import { z } from "zod";
import { TAclId } from "~/data/data.acl";
import { utilExpandAcl } from "./util.expand-acl";

const input = z.object({
  features: z.array(z.custom<TAclId>()),
  acl: z.array(z.custom<TAclId>()),
});
type Input = z.infer<typeof input>;
export function utilCanAccess(_arg: Input): boolean {
  const arg = input.parse(_arg);

  if (arg.features.includes("None")) {
    return false;
  }

  const expandedAcl = utilExpandAcl(arg.acl);
  if (
    arg.features.includes("All") ||
    arg.features.length == 0 ||
    expandedAcl.includes("All") ||
    expandedAcl.length == 0
  ) {
    return true;
  }
  const allowAcls = expandedAcl.filter((i) => {
    return arg.features.includes(i);
  });
  return allowAcls.length > 0;
}