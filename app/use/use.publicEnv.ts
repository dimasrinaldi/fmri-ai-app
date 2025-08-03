import { useRootStore } from "~/root/store";

export default function usePublicEnv() {
  return useRootStore().publicEnv
}
