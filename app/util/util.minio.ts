import * as Minio from 'minio'
import { configServer } from '~/config/config.server';

// export const utilMinIo = () => {
//   const minioClient = new Minio.Client({
//     endPoint: configServer.minioEndpoint,
//     port: configServer.minioPort,
//     accessKey: configServer.minioAccessKey,
//     secretKey: configServer.minioSecretKey,
//   })
//   return minioClient
// };


export const utilMinIo = <T>(fn: (arg: {
  bucket: string,
  client: Minio.Client,
}) => T) => {
  const minioClient = new Minio.Client({
    endPoint: configServer.minioEndpoint,
    port: configServer.minioPort,
    accessKey: configServer.minioAccessKey,
    secretKey: configServer.minioSecretKey,
  })
  return fn({
    bucket: configServer.minioBucket,
    client: minioClient,
  })
};

