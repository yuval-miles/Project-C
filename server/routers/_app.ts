/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from "../createRouter";
import { lastfmRouter } from "./lastfmRouter";
import { collectionRouter } from "./collectionRouter";
import { userRouter } from "./userRouter";
import superjson from "superjson";

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  // .formatError(({ shape, error }) => { })
  /**
   * Add a health check endpoint to be called with `/api/trpc/healthz`
   */
  .query("healthz", {
    async resolve() {
      return "yay!";
    },
  })
  .merge("Albums.", lastfmRouter)
  .merge("Users.", userRouter)
  .merge("Collections.", collectionRouter);

export type AppRouter = typeof appRouter;
