import knex from "knex";
import skeys from "snakecase-keys";
import { configServer } from "~/config/config.server";

export const dbKnex = knex({
  client: "pg",
  connection: {
    host: configServer.dbHost,
    port: configServer.dbPort,
    user: configServer.dbUser,
    password: configServer.dbPass,
    database: configServer.dbName,
  },
});

const dbTableInfo = {
  user: { name: "user" },
};

type KeysUnion = keyof typeof dbTableInfo;
export const dbTn = (name: KeysUnion, alias: string = "") => {
  const asAlias = alias.length > 0 ? " as " + alias : "";
  return `${dbTableInfo[name].name}${asAlias}`;
};
export const dbPreSave = (input: readonly any[] | Record<string, any>) => {
  return skeys(input);
};
