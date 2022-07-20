import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../prisma";

export const collectionRouter = createRouter().mutation("createCollection", {
  async resolve({ ctx }) {
    try {
      if (!ctx.session)
        return { message: "FORBIDDEN", response: "UNAUTHORIZED" };
      await prisma.collection.create({
        data: {
          name: "test",
          userId: ctx.session.id as string,
        },
      });
      return { message: "success", response: "Collection created" };
    } catch (err) {
      return { message: "Failed", response: "Creation failed" };
    }
  },
});
