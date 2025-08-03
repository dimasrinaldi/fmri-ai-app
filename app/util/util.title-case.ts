import _ from "lodash";

export function utilTitleCase(str: string) {
  return _.startCase(_.snakeCase(str).replace(/\s/g, ""));
}
