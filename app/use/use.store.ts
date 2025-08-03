import { utilToJs } from "~/util/util.to-js";
import { useMob } from "./use.mob";

export function useStore<
  TStore extends TState &
    TAction & {
      setState: (arg: Partial<TState>) => void;
      state: TState;
      readonly toJs: TState & TAction;
    },
  TState extends Record<string, any> = object,
  TAction extends object = object
>({
  initializer = () => ({} as any),
  action = () => ({} as any),
}: {
  initializer?: () => TState;
  action?: () => TAction;
}) {
  const state = useMob(initializer ?? (() => ({})));
  const store: TStore = useMob(() => {
    // console.log(Object.getOwnPropertyDescriptors(state), "dsfdsf-");

    let myAction: any = {
      setState(arg: Partial<typeof state>) {
        Object.assign(state, arg);
      },
      get toJs() {
        const istate = utilToJs(state);
        let newObj: any = {};
        Object.keys(action()).forEach((i) => {
          newObj[i] = store[i];
        });
        return { ...istate, ...newObj };
      },
      get state() {
        return state;
      },
    };
    Object.keys(state).forEach((i) => {
      Object.defineProperty(myAction, i, {
        get: function () {
          return state[i];
        },
      });
    });
    myAction = Object.defineProperties(
      {},
      {
        ...Object.getOwnPropertyDescriptors(myAction),
        ...Object.getOwnPropertyDescriptors(action()),
      }
    );

    return myAction as any;
  });

  return store;
}
