"use client"
import React from "react";
import { Prisma } from '@prisma/client';
import { MemoCard, WordCard } from "@/components";
import { updateReviewTimes } from "./server-actions";
import { TWordCard } from "./page";

interface IProps {
    wordCards: TWordCard[]
}

export function WordCards(props: IProps) {
    const [wordList, setWordList] = React.useState(props.wordCards);

    const [cardInfo, setCardInfo] = React.useState<Prisma.memo_cardGetPayload<{}> | null>(null);

    const [showGlass, setShowGlass] = React.useState(false);

    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        document.addEventListener("mouseup", (event) => {
            const target = event.target;
            if (target instanceof Node) {  // 使用类型守卫确保 target 是 Node 类型
                const inContainer =
                    target === containerRef.current
                    || containerRef.current?.contains(target);
                if (inContainer === false) {
                    setShowGlass(false);
                }
            }
        });
    }, []);

    async function handleRecognizeClick(id: string) {
        await updateReviewTimes(id);
        setWordList(prev => prev.filter(item => item.id !== id));
    }

    function handleUnRecognizeClick(item: TWordCard) {
        setShowGlass(true);
        setCardInfo(item.memo_card);
    }

    return (
        <>
            {showGlass && cardInfo ? (
                <div className="fixed w-[100vw] h-[100vh] left-[0] top-[0] glass overflow-scroll z-[10000]">
                    <div ref={containerRef} className="absolute w-[750px] left-[50%] top-[50%] center">
                        <MemoCard {...cardInfo} />
                    </div>
                </div>
            ) : null}
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(210px,_1fr))] gap-4">
                {wordList.map(item => (
                    <WordCard
                        key={item.id}
                        wordCardInfo={item}
                        onRecognize={handleRecognizeClick}
                        onUnRecognize={handleUnRecognizeClick}
                    />
                ))}
            </div>
        </>
    )
}