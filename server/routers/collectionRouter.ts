import { createRouter } from "../createRouter";
import { z } from "zod";
import { prisma } from "../prisma";
import type { Context } from "../context";

const validateUserCollection = async (ctx: Context, id: string) => {
  if (!ctx.session || !ctx.session.user) return false;
  const found = await prisma.collection.findFirst({
    where: {
      id: id,
      userId: ctx.session.id as string,
    },
  });
  if (!found) return false;
  return true;
};

export const collectionRouter = createRouter()
  .mutation("createCollection", {
    input: z.string(),
    async resolve({ input, ctx }) {
      try {
        if (!ctx.session)
          return {
            message: "failed",
            response: "NO AUTHORIZATION TOKEN PRESENT",
          };
        const collection = await prisma.collection.create({
          data: {
            name: input,
            userId: ctx.session.id as string,
          },
        });
        return { message: "success", response: collection };
      } catch (err) {
        return { message: "Failed", response: "Creation failed" };
      }
    },
  })
  .query("getCollection", {
    input: z.string(),
    async resolve({ input, ctx }) {
      if (!ctx.session)
        return {
          message: "failed",
          response: "NO AUTHORIZATION TOKEN PRESENT",
        };
      const collection = await prisma.collection.findUnique({
        where: {
          id: input,
        },
      });
      if (!collection)
        return {
          message: "failed",
          response: `Cannot find collection with id ${input}`,
        };
      if (collection.userId !== ctx.session.id)
        return { message: "failed", response: "UNAUTHORIZED" };
      return { message: "success", response: collection };
    },
  })
  .mutation("updateAddedItems", {
    input: z.object({
      collectionID: z.string(),
      addedItems: z.object({}).catchall(
        z.object({
          url: z.string(),
          artist: z.string(),
          albumName: z.string(),
          id: z.string(),
        })
      ),
    }),
    async resolve({ input, ctx }) {
      if (!(await validateUserCollection(ctx, input.collectionID)))
        return { message: "failed", response: "UNAUTHORIZED" };
      const updatedCollection = await prisma.collection.update({
        where: {
          id: input.collectionID,
        },
        data: {
          addedItems: input.addedItems,
        },
      });
      return { message: "success", response: updatedCollection };
    },
  })
  .mutation("updateCollectionSettings", {
    input: z.object({
      collectionSettings: z.object({
        collectionType: z.string(),
        gridRows: z.number(),
        gridColumns: z.number(),
        checkboxArr: z.array(z.string()),
        padding: z.number(),
      }),
      collectionID: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!(await validateUserCollection(ctx, input.collectionID)))
        return { message: "failed", response: "UNAUTHORIZED" };
      const updatedCollection = await prisma.collection.update({
        where: {
          id: input.collectionID,
        },
        data: {
          collectionSetting: input.collectionSettings,
        },
      });
      return { message: "success", response: updatedCollection };
    },
  })
  .mutation("updateCollectionName", {
    input: z.object({ newName: z.string(), collectionID: z.string() }),
    async resolve({ ctx, input }) {
      if (!(await validateUserCollection(ctx, input.collectionID)))
        return { message: "failed", response: "UNAUTHORIZED" };
      const updatedCollection = await prisma.collection.update({
        where: {
          id: input.collectionID,
        },
        data: {
          name: input.newName,
        },
      });
      return { message: "success", response: updatedCollection };
    },
  })
  .mutation("deleteCollection", {
    input: z.string(),
    async resolve({ ctx, input }) {
      if (!(await validateUserCollection(ctx, input)))
        return { message: "failed", response: "UNAUTHORIZED" };
      const deletedCollection = await prisma.collection.delete({
        where: {
          id: input,
        },
      });
      return { message: "success", response: deletedCollection };
    },
  });
