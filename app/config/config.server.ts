import { configPublic } from "./config.public";
import _ from "lodash";

const defaultEnv = "FROM_ENV";
const config = {
  dbHost: process.env.DB_HOST || defaultEnv,
  dbPort: parseInt(process.env.DB_PORT || "100"),
  dbUser: process.env.DB_USER || defaultEnv,
  dbPass: process.env.DB_PASS || defaultEnv,
  dbName: process.env.DB_NAME || defaultEnv,

  minioEndpoint: process.env.MINIO_ENDPOINT || defaultEnv,
  minioPort: parseInt(process.env.MINIO_PORT || "9000"),
  minioAccessKey: process.env.MINIO_ACCESS_KEY || defaultEnv,
  minioSecretKey: process.env.MINIO_SECRET_KEY || defaultEnv,
  minioBucket: process.env.MINIO_BUCKET || defaultEnv,

  useSsl: process.env.USE_SSL == "true",
  cookieSecret: process.env.COOKIE_SECRET || defaultEnv,
  cookieKey: process.env.COOKIE_KEY || defaultEnv,

  roleSystemId: process.env.ROLE_SYSTEM_ID || defaultEnv,
  roleGuestId: process.env.ROLE_GUEST_ID || defaultEnv,
  systemId: process.env.SYSTEM_ID || defaultEnv,
  guestId: process.env.GUEST_ID || defaultEnv,

} as const;

export const configServer = _.merge(config, configPublic);
