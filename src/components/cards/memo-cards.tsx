"use client"
import React from "react";
import { MemoCard } from "@/components";
import { Prisma } from '@prisma/client';

interface IProps {
    memoCardsInitial: Prisma.memo_cardGetPayload<{}>[]
}

export function MemoCards(props: IProps) {
    const { memoCardsInitial } = props;
    const [memoCards, setMemoCards] = React.useState(memoCardsInitial);

    function handleDelete(id: string) {
        setMemoCards(prev => prev.filter(card => card.id !== id));
    }

    return (
        <>
            {memoCards?.map(card => (
                <div key={card.id}>
                    <MemoCard {...card} onDelete={handleDelete} />
                </div>
            ))}
        </>
    )
}