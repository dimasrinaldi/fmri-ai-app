import validator from "validator";

export function utilZodErrFromStr<Z extends string>(
  message: string,
  keys: readonly Z[]
): Record<Z, string> {
  let zodErr: any[] = [];
  if (validator.isJSON(message)) {
    let errObj = JSON.parse(message);
    if (Array.isArray(errObj)) {
      zodErr = errObj;
    }
  }
  let result: any = {};
  keys.forEach((key) => {
    result[key] =
      zodErr.find((i) => {
        if (Array.isArray(i.path)) {
          return i.path.includes(key);
        }
        return false;
      })?.message ?? "";
  });
  return result;
}
