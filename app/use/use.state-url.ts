import _ from "lodash";
import { useQurlStore } from "~/provider/provider.qurl";
import { useCraftStore } from "./use.craft-store";
import { useMob } from "./use.mob";

export function useStateUrl<T extends Record<string, string>>(args: T) {
  const qurl = useQurlStore();

  const store = useMob(() => ({
    get keyMap() {
      let result: any = {};
      Object.keys(args).forEach((i) => {
        result[i] = _.kebabCase(i);
      });
      return result;
    },
    get query(): T {
      let result: any = {};
      Object.keys(store.keyMap).forEach((i) => {
        result[i] = qurl.queryVal(store.keyMap[i], args[i]);
      });
      return result;
    },
  }));

  const pStore = useCraftStore(
    () => ({
      setState(iState: Partial<T>) {
        let result: any = {};
        Object.keys(store.keyMap).forEach((i) => {
          result[store.keyMap[i]] = iState[i];
        });
        qurl.setQuery(result);
      },
    }),
    () => [store.query]
  );

  return pStore as T & { setState: (arg: Partial<T>) => void };
}
