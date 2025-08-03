import _ from "lodash";
import { TAclId } from "~/data/data.acl";

export function utilExpandAcl(acl: TAclId[]): TAclId[] {
    const expandedAcl = acl.flatMap((i) => {
        const comps = i.split("_");
        return [`${comps[0]}_View`, i];
    });
    const result = _.uniq(expandedAcl) as TAclId[];
    return result;
}
