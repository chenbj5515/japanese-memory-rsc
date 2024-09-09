import { z } from 'zod'
import { prisma } from "@/prisma"
import { protectedProcedure } from './trpc'

export const memoCardRouters = {
    incrementReviewTimes: protectedProcedure
        .input(z.string())
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
    updateKanaPronunciation: protectedProcedure
        .input(z.object({
            id: z.string(),  // 假设 id 是字符串类型
            kana_pronunciation: z.string(),
        }))
        .mutation(async ({ input }) => {
            const { id, kana_pronunciation } = input;
            const updatedCard = await prisma.memo_card.update({
                where: { id },
                data: { kana_pronunciation },
            });
            return updatedCard;
        }),
    updateTraslation: protectedProcedure
        .input(z.object({
            id: z.string(),  // 假设 id 是字符串类型
            translation: z.string(),
        }))
        .mutation(async ({ input }) => {
            const { id, translation } = input;
            const updatedCard = await prisma.memo_card.update({
                where: { id },
                data: { translation },
            });
            return updatedCard;
        }),
}