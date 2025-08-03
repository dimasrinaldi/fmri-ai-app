export type TUtilFilePathSub = "shoe-detection" | "temp";
export const utilFilePath = (sub: TUtilFilePathSub, name: string) => {
  return `${sub}/${name}`;
};
