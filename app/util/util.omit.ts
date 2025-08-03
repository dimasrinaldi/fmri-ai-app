export function utilOmit<Obj extends object, Key extends keyof Obj>(
  obj: Obj,
  ...removeN: Key[]
): Omit<Obj, Key> {
  let objDesc = Object.getOwnPropertyDescriptors(obj);
  removeN.forEach((i) => {
    delete objDesc[i];
  });
  return Object.defineProperties({}, objDesc) as any;
}
