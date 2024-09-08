import { prisma } from "@/prisma"
import { protectedProcedure } from './trpc'

export const memoCardRouters = {
    incrementReviewTimes: protectedProcedure
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
}