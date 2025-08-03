import { configPublic } from "~/config/config.public";

export function utilPublicEnv() {
  return typeof window == "undefined" ? configPublic
    : ((window as any).ENV?.json || configPublic) as typeof configPublic;
}
