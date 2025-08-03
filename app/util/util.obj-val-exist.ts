import _ from "lodash";

export const utilObjValExist = (obj: any) => {
  let nObj = _.clone(obj ?? {});

  for (const key in nObj) {
    if (typeof nObj[key] == "undefined") {
      delete nObj[key];
    }
  }
  return nObj;
};
