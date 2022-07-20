import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../prisma";
import * as bcrypt from "bcrypt";

const userNameValidator: RegExp =
  /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
const emailValidator: RegExp =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const userRouter = createRouter()
  .mutation("createUser", {
    input: z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    }),
    async resolve({ input }) {
      try {
        if (
          !userNameValidator.test(input.name) ||
          !emailValidator.test(input.email)
        )
          return { message: "failed", response: "Validation failed" };
        const hashPass = bcrypt.hashSync(input.password, 10);
        input.password = hashPass;
        const newUser = await prisma.user.create({ data: input });
        return { message: "success", response: "User Created" };
      } catch (err) {
        return { message: "failed", response: `${err}` };
      }
    },
  })
  .query("getUser", {
    input: z.object({
      email: z.string(),
      password: z.string(),
    }),
    async resolve({ input: { password, email } }) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        if (user.password) {
          if (bcrypt.compareSync(password, user.password))
            return { message: "success", response: user };
          else return { message: "failed", response: "Invalid password" };
        }
      } else {
        return {
          message: "failed",
          response: "Cannot find user with that email",
        };
      }
    },
  })
  .query("userExists", {
    input: z.object({ email: z.string(), userName: z.string() }),
    async resolve({ input: { email, userName } }) {
      try {
        const exists = await prisma.user.findFirst({
          where: {
            OR: [
              {
                email,
              },
              {
                name: userName,
              },
            ],
          },
        });
        if (exists) {
          if (exists.name === userName && exists.email === email)
            return {
              message: "success",
              response: { usernameExists: true, emailExists: true },
            };
          else if (exists.name !== userName && exists.email === email)
            return {
              message: "success",
              response: { usernameExists: false, emailExists: true },
            };
          else
            return {
              message: "success",
              response: { usernameExists: true, emailExists: false },
            };
        } else
          return {
            message: "success",
            response: { usernameExists: false, emailExists: false },
          };
      } catch (err) {
        return { message: "failed", response: `Something went wrong ${err}` };
      }
    },
  })
  .query("getCollections", {
    input: z.string(),
    async resolve({ input, ctx }) {
      if (!ctx.session || !ctx.session.user || input !== ctx.session.user.name)
        return { message: "FORBIDDEN", response: [] };
      const collections = await prisma.collection.findMany({
        where: {
          userId: ctx.session.id as string,
        },
      });
      return { message: "success", response: collections };
    },
  });
