//@ts-ignore
import getmime from "base64mime"
import md5 from "md5";

export const utilMetaBase64Url = (input: {
  tags: string[], fileName: string, base64Url: string
}) => {
  const newTags = input.tags.map(i => i.replace(/[^a-zA-Z0-9]/g, ''));
  const mimeType = getmime(input.base64Url);
  const fileName = input.fileName.replace(/[^a-zA-Z0-9.]/g, '')
  const newFileName = newTags.join("_") + "_" + md5(input.fileName) + "_" + fileName;
  const base64Data = input.base64Url.slice(input.base64Url.indexOf(",") + 1);
  return {
    id: md5(newFileName),
    fileName: newFileName,
    mimeType,
    base64Data,
    tags: newTags
  };
};
