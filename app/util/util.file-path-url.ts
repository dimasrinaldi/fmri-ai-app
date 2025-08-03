import { configServer } from "~/config/config.server";
import { TUtilFilePathSub, utilFilePath } from "./util.file-path";

export const utilFilePathUrl = (sub: TUtilFilePathSub, name: string) => {
  const filePathUri = utilFilePath(sub, name);
  const fullUrl = `https://${configServer.minioEndpoint}/api/v1/buckets/fmri-apps/objects/download?prefix=${filePathUri}&version_id=null`;
  return fullUrl;
};
