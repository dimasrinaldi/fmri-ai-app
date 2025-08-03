import { utilOmit } from "./util.omit";

export function utilPick<Obj extends object, Key extends keyof Obj>(
  obj: Obj,
  ...pickN: Key[]
): Pick<Obj, Key> {
  let objDesc = Object.getOwnPropertyDescriptors(obj);
  const excludedKeys = Object.keys(objDesc).filter((i) => {
    return !pickN.includes(i as any);
  });

  return utilOmit(obj, excludedKeys as any) as any;
}
