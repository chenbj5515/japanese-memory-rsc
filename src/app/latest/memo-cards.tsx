"use client"
import React from "react";
import { MemoCard } from "@/components";
import { Prisma } from '@prisma/client';

interface IProps {
    memoCardsInitial: Prisma.memo_cardGetPayload<{}>[]
}

export function MemoCards(props: IProps) {
    const { memoCardsInitial } = props;
    console.log(memoCardsInitial, "memoCardsInitial===")
    const [memoCards, setMemoCards] = React.useState(memoCardsInitial);

    return (
        <>
            {memoCards?.map(card => (
                <div key={card.id}>
                    <MemoCard {...card} setMemoCards={setMemoCards} />
                </div>
            ))}
        </>
    )
}