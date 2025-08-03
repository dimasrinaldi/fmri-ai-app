import URLParse from "url-parse";
import { utilStrToQs } from "./util.str-to-qs";

export function utilStrToHref(url: string) {
  let urlObj = URLParse(url);
  let qstr = utilStrToQs(urlObj.query);
  let query: Record<string, string> = (URLParse.qs.parse(qstr) ?? {}) as any;
  return { path: urlObj.pathname, query };
}
