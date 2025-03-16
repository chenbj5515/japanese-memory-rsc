import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/prisma";
import { MemoCards, LocalCards, InputBox, WordCardAdder } from "@/components";
// import Loading from "@/components/ui/loading";

export default async function MemoCardsPage() {
  const session = await getSession()

  if (!session) {
    return new Error("Unauthorized")
  }

  const newCardsCount = await prisma.memo_card.count({
    where: {
      user_id: session?.user?.id,
      review_times: 0
    }
  });

  const newCardsPromise = prisma.memo_card.findMany({
    where: {
      user_id: session?.user?.id,
      review_times: 0
    },
    orderBy: {
      id: 'desc',
    },
    take: 10,
  });

  const remainingCount = Math.max(0, 10 - newCardsCount);

  const forgottenCardsPromise = remainingCount > 0 ? prisma.memo_card.findMany({
    where: {
      user_id: session?.user?.id,
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
        <MemoCards
          newCardsPromise={newCardsPromise}
          forgottenCardsPromise={forgottenCardsPromise}
        />
        <LocalCards />
      </div>
      <div className="fixed z-[12] max-w-80-680 left-[50%] -translate-x-1/2 bottom-2 min-h-[50px] w-[100%]">
        <InputBox />
      </div>
      <WordCardAdder />
    </>
  )
}