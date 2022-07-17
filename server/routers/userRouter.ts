import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../prisma";
import * as bcrypt from "bcrypt";

export const userRouter = createRouter()
  .mutation("createUser", {
    input: z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.users.create({ data: input });
    },
  })
  .query("getUser", {
    input: z.object({
      email: z.string(),
      password: z.string(),
    }),
    async resolve({ input: { password, email } }) {
      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        if (bcrypt.compareSync(password, user.password))
          return { message: "success", response: user };
        else return { message: "failed", response: "Invalid password" };
      } else {
        return {
          message: "failed",
          response: "Cannot find user with that email",
        };
      }
    },
  });
