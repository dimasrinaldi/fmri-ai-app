export function utilToJs<TVal>(mVal: TVal): TVal {
  if (["function", "undefined"].includes(typeof mVal) || mVal == null) {
    return undefined as any;
  } else if (Array.isArray(mVal)) {
    return mVal.map((i) => utilToJs(i)).filter((i) => i) as any;
  } else if (typeof mVal == "object") {
    let keys = Object.getOwnPropertyNames(mVal);
    let result: any = {};
    keys.forEach((key) => {
      let val = (mVal as any)[key];
      let newVal = utilToJs(val);
      if (typeof newVal != "undefined") {
        result[key] = newVal;
      }
    });
    return result;
  } else {
    return mVal;
  }
}
