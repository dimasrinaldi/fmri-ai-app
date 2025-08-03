import { utilToJs } from "./util.to-js";

let logStateJob: any;
let logStateMap: Record<string, any> = {};
export function utilLogMoStore(name: string, _store: any) {
  logStateMap[name] = utilToJs(_store);
  clearTimeout(logStateJob);
  logStateJob = setTimeout(() => {
    console.log(logStateMap);
    logStateMap = {};
  }, 3000);
}
