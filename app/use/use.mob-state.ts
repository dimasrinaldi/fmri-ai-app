import { runInAction } from "mobx";
import { utilAssignExist } from "~/util/util.assign-exist";
import { useMob } from "./use.mob";

export function useMobState<TState extends Record<string, any>>(
  fn: () => TState
) {
  const store = useMob(() => ({
    ...fn(),
    setState(partialState: Partial<TState>) {
      runInAction(() => {
        utilAssignExist(store, partialState);
      });
    },
  }));
  return store;
}
