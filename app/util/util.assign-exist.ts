export const utilAssignExist = (obj1: any, obj2: any) => {
  for (const key in obj2) {
    if (typeof obj2[key] == "undefined") continue;
    try {
      obj1[key] = obj2[key];
    } catch (e) {}
  }
};
