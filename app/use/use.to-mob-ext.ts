import md5 from "md5";
import { runInAction } from "mobx";
import { useUpdateEffect } from "react-use";
import useVal from "./use.val";
import { useRef, useState } from "react";
import _ from "lodash";
import { useMob } from "./use.mob";

export function useToMobExt<
  TExt extends Record<string, any>,
  TResult extends TExt & {
    isApiInitFetched: boolean;
  }
>(__args: TExt, opt?: {
  keepPrevData?: boolean
}) {
  const keepPrevData = opt?.keepPrevData ?? true;
  let _args: any = { ...__args };
  // trpc keep prev data
  const dataKeeper = useRef<Record<string, any>>({});
  const apis: any[] = useVal(() => {
    const keys = Object.keys(_args);
    return keys
      .map((key) => {
        let i = _args[key];
        i = { ...i };
        const isTrpc = _.has(i, "isFetched") && _.has(i, "data");
        if (isTrpc) {
          i._isTrpc = true;
          if (keepPrevData) {
            if (i.isFetched && i.data) {
              dataKeeper.current[key] = i.data;
            }
            if (i.isFetching && dataKeeper.current[key]) {
              i.data = dataKeeper.current[key];
              _args[key] = i;
            }
          }
        }
        return i;
      })
      .filter((i) => typeof i == "object" && i._isTrpc);
  });

  // trpc calculate all apifetched
  const apiIsFetched = useVal(() => {
    return apis.length == apis.filter((i) => i.isFetched).length;
  });
  const [isApiInitFetched, setIsApiInitFetched] = useState(apiIsFetched);
  useUpdateEffect(() => {
    if (!apiIsFetched) return;
    setIsApiInitFetched(true);
  }, [apiIsFetched]);

  // convert to mobx
  const args = { ..._args, isApiInitFetched };
  const extState = useMob(() => args);
  useUpdateEffect(() => {
    runInAction(() => {
      Object.assign(extState, args);
    });
  }, [md5(JSON.stringify(args))]);

  return extState as unknown as TResult;
}
