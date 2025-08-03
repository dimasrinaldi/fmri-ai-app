import { utilStrToQs } from "./util.str-to-qs";

export const utilUrlFromComp = (arg: {
  pathname: string;
  queryString: string;
}) => {
  let myqs = utilStrToQs(arg.queryString);
  return arg.pathname + (myqs ? "?" + myqs : "");
};
