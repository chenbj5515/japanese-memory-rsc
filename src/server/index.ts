import { prisma } from "@/prisma"
import { procedure, router, createCallerFactory } from './trpc'

/**
 * router of tRPC-backend
 * @link https://trpc.io/docs/quickstart#1-create-a-router-instance
 */
export const appRouter = router({
  hello: procedure.query(() => {
    return { msg: 'Hello World' }
  }),
  incrementReviewTimes: procedure
    .input((val: unknown) => {
      // 验证输入为数字类型
      if (typeof val === 'string') return val;
      throw new Error('Invalid input');
    })
    .mutation(async ({ input }) => {
      const updatedRecord = await prisma.memo_card.update({
        where: { id: input }, // 使用输入的ID查找
        data: {
          review_times: {
            increment: 1, // 在现有的review_times基础上加1
          },
        },
      });
      return updatedRecord;
    }),
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)