import { LoaderFunctionArgs } from "@remix-run/node";
import mime from "mime-types";
import { configServer } from "~/config/config.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const fileUrl = (params as any)["*"];
  const mimeType = mime.lookup(fileUrl);
  if (!mimeType) {
    throw new Error("Invalid mime type");
  }
  const filePathUri = decodeURIComponent(fileUrl);
  const fullUrl = `https://${configServer.minioEndpoint}/api/v1/buckets/fmri-apps/objects/download?prefix=${filePathUri}&version_id=null`;
  const resp = await fetch(fullUrl);
  return new Response(resp.body);
}

// export async function loader({ params }: LoaderFunctionArgs) {
//   const fileUrl = (params as any)["*"];
//   const mimeType = mime.lookup(fileUrl);
//   if (!mimeType) {
//     throw new Error("Invalid mime type");
//   }
//   try {
//     const dataStream = await utilMinIo((i) => i.client.getObject(i.bucket, fileUrl));
//     const strBase64 = await new Promise<string>((resolve) => {
//       dataStream.on("data", (chunk: Buffer) => {
//         resolve(chunk.toString("base64"));
//       });
//     })
//     const base64Data = Buffer.from(strBase64, "base64");

//     return new Response(base64Data, {
//       headers: {
//         "Content-Type": "image/png",
//         "Content-Length": base64Data.length.toString(),
//         "Content-Disposition": `inline; filename="${fileUrl}"`,
//       },
//     });
//   } catch (error: any) {
//     return new Response(error.message);
//   }
// }

// ShoeDetection_eb4f13a04a4a1fd5a1dfa682fb8bbe37_1000.jpg
// ShoeDetection_eb4f13a04a4a1fd5a1dfa682fb8bbe37_1000.jpg
