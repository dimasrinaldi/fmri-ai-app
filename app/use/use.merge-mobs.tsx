import { utilMergeGet } from "~/util/util.merge-get";
import { useMob } from "./use.mob";

export function useMergeMobs<
  TMob1 extends Record<string, any>,
  TMob2 extends Record<string, any>,
  TMob3 extends Record<string, any>,
  TMob4 extends Record<string, any>,
  TMob5 extends Record<string, any>,
  TResult extends TMob1 & TMob2 & TMob3 & TMob4 & TMob5
>(fnArrMerge: () => [TMob1, TMob2, TMob3?, TMob4?, TMob5?]): TResult {
  const store = useMob(() => {
    return utilMergeGet(fnArrMerge);
  });
  return store as any;
}
