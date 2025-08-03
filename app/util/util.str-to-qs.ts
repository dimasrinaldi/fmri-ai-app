import URLParse from "url-parse";

export const utilStrToQs = (str: string) => {
  return URLParse.qs.stringify(URLParse.qs.parse(str));
};
