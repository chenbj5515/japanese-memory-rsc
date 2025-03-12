import React, { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { MemoCards, LocalCards, InputBox, WordCardAdder } from "@/components";
import Loading from "@/components/ui/loading";

export default async function Home() {
  const session = await auth()

  const newCardsCountPromise = prisma.memo_card.count({
    where: {
      user_id: session?.userId,
      review_times: 0
    }
  });

  const newCardsPromise = prisma.memo_card.findMany({
    where: {
      user_id: session?.userId,
      review_times: 0
    },
    orderBy: {
      create_time: 'desc',
    },
  });

  const newCardsCount = await newCardsCountPromise;
  const remainingCount = Math.max(0, 10 - newCardsCount);

  const forgottenCardsPromise = remainingCount > 0 ? prisma.memo_card.findMany({
    where: {
      user_id: session?.userId,
      review_times: {
        gt: 0
      }
    },
    orderBy: {
      forget_count: 'desc',
    },
    take: remainingCount,
  }) : Promise.resolve([]);

  return (
    <>
      <div className="pb-[36px]">
        <Suspense fallback={<Loading />}>
          <MemoCards
            newCardsPromise={newCardsPromise}
            forgottenCardsPromise={forgottenCardsPromise}
          />
        </Suspense>
        <LocalCards />
      </div>
      <div className="fixed z-[12] max-w-80-680 left-[50%] -translate-x-1/2 bottom-2 h-[50px] w-[100%]">
        <InputBox />
      </div>
      <WordCardAdder />
    </>
  )
}