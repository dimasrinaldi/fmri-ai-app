import _ from "lodash";

export function utilMergeGet<
  TMob1 extends object,
  TMob2 extends object,
  TMob3 extends object,
  TMob4 extends object,
  TMob5 extends object
>(
  fnArrMerge: () => [TMob1, TMob2, TMob3?, TMob4?, TMob5?]
): TMob1 & TMob2 & TMob3 & TMob4 & TMob5 {
  let result: any = {};
  let listOfObjs = fnArrMerge();
  const myLength = listOfObjs.length;
  for (let i = 0; i < myLength; i++) {
    if (!listOfObjs[i]) continue;
    const myObj = listOfObjs[i] ?? {};
    const myObjKeys = Object.keys(Object.getOwnPropertyDescriptors(myObj));
    for (let j of myObjKeys) {
      if (_.has(result, j)) continue;
      Object.defineProperty(result, j, {
        enumerable: true,
        get: function () {
          return (fnArrMerge() as any)[i]?.[j];
        },
      });
    }
  }
  return result;
}
