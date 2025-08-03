import { useLocation } from "@remix-run/react";
import { useToMob } from "./use.to-mob";

export const useLoc = () => {
  const store = useToMob(useLocation());
  return store;
};
