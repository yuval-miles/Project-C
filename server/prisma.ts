/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { env } from "./env";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

prisma.$use(async (params, next) => {
  if (params.model === "users") {
    if (params.action === "create" || params.action === "update") {
      if (params.args.data.password) {
        // const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(params.args.data.password, 10);
        params.args.data.password = hashPass;
      }
    }
  }
  return next(params);
});

if (env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prisma;
}
