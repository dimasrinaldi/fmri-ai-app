import lzstring from "lz-string";
import { useEffect } from "react";
import { utilAssignExist } from "~/util/util.assign-exist";
import { utilJobDelay } from "~/util/util.job-delay";
import { useMobState } from "./use.mob-state";
const { compress, decompress } = lzstring;
export function useMobStateStorage<TState extends Record<string, any>>(key: string,
  fn: () => TState
) {
  const state = useMobState(() => {
    let initState = fn();
    const decompressedJson = decompress(sessionStorage.getItem(key) ?? compress("{}"));
    const storageState = JSON.parse(decompressedJson);
    utilAssignExist(initState, storageState);
    return initState
  });
  useEffect(() => {
    utilJobDelay("saveLocalStorage" + key, () => {
      const compressedJson = compress(JSON.stringify(state))
      sessionStorage.setItem(key, compressedJson);
    }, 1000)
  }, [JSON.stringify(state)])

  return state;
}
