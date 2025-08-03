import md5 from "md5";
import { runInAction } from "mobx";
import { useUpdateEffect } from "react-use";
import { useMob } from "./use.mob";

export function useToMob<TExt extends Record<string, any>>(args: TExt) {
  const extState = useMob(() => args);
  useUpdateEffect(() => {
    runInAction(() => {
      Object.assign(extState, args);
    });
  }, [md5(JSON.stringify(args))]);
  return extState;
}
