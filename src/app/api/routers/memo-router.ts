// import { t } from '@/trpc';
// import { prisma } from '@/prisma';
// import { z } from 'zod';

// export const memoRouter = t.router({
//   getAll: t.procedure.query(async () => {
//     return await prisma.memo_card.findMany();
//   }),

//   incrementReviewTimes: t.procedure
//     .input(z.object({ id: z.string() }))
//     .mutation(async ({ input }) => {
//       return prisma.memo_card.update({
//         where: { id: input.id },
//         data: {
//           review_times: {
//             increment: 1,
//           },
//         },
//       });
//     }),
// });
