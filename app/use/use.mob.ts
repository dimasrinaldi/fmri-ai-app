import { useLocalObservable } from "mobx-react";

export function useMob<TStore extends Record<string, any>>(arg: () => TStore) {
  return useLocalObservable(arg);
}
