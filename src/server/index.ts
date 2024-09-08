import { router, createCallerFactory } from './trpc'
import { memoCardRouters } from "./memo_card";
/**
 * router of tRPC-backend
 * @link https://trpc.io/docs/quickstart#1-create-a-router-instance
 */
export const appRouter = router({
  ...memoCardRouters
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)