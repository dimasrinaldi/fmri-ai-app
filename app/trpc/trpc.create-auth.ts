import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { configServer } from "~/config/config.server";
import { TAclId } from "~/data/data.acl";
import { db } from "~/db/db.app";
import { utilCanAccess } from "~/util/util.can-access";

export const trpcCreateAuth = (cookie: any) => z
  .function()
  .args(
    z.object({
      features: z.array(z.custom<TAclId>()).default([]),
      defaultAsGuest: z.boolean().default(false),
    })
  )
  .implement(async (args) => {
    const users = await db
      .selectFrom("user")
      .leftJoin("client", "client.id", "user.clientId")
      .leftJoin("role", "role.id", "user.roleId")
      .select([
        "user.id",
        "user.name",
        "user.username",
        "client.id as clientId",
        "client.name as clientName",
        "client.apps as clientApps",
        "role.id as roleId",
        "role.name as roleName",
        "role.acl",
      ])
      .where("user.id", "in", [cookie.userId, configServer.guestId])
      .where("user.status", "=", "Active")
      .orderBy("user.id", "desc")
      .execute();

    const user = {
      ...users[0],
      clientId: users[0].clientId ?? "",
      clientName: users[0].clientName ?? "",
      clientApps: users[0].clientApps ?? [],
      roleId: users[0].roleId ?? "",
      roleName: users[0].roleName ?? "",
      isGuest: users[0].id === configServer.guestId,
    };

    if (!args.defaultAsGuest && users.length === 1) {
      throw new TRPCError({
        message: "Unauthenticated",
        code: "UNAUTHORIZED",
      });
    }

    const isCanAccess = utilCanAccess({
      features: args.features,
      acl: user.acl ?? ["None"],
    });

    if (!isCanAccess) {
      throw new TRPCError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }
    return {
      ...user,
      canAccess: (features: TAclId[] = []) => utilCanAccess({
        features,
        acl: user.acl ?? [],
      }),
    };
  });
