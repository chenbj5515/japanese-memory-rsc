"use client"
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { MemoCard } from "@/components"
import { RootState } from "@/store";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export function LocalCards() {
    const { localCards } = useTypedSelector((state: RootState) => state.localCardsSlice);
    console.log(localCards, "localCards=========")
    return (
        <>
            {localCards?.map(card => (
                <MemoCard key={card.id} {...card} />
            ))}
        </>
    )
}