import { useLocalObservable } from "mobx-react";
import { utilMergeGet } from "~/util/util.merge-get";

export function useCraftStore<
  TAction extends object,
  TMob1 extends object,
  TMob2 extends object,
  TMob3 extends object,
  TMob4 extends object
>(
  action: () => TAction,
  merge: () => [TMob1, TMob2?, TMob3?, TMob4?] = () => [{} as TMob1]
): TAction & TMob1 & TMob2 & TMob3 & TMob4 {
  return useLocalObservable(() => {
    return utilMergeGet(() => {
      const myAction = action();
      const merged = merge();
      return [myAction, ...merged];
    }) as any;
  });
}
