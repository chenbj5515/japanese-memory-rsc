"use client"
import { useRouter } from "next/navigation";
import React from "react";
import { $Enums, Prisma } from '@prisma/client';
import { MemoCard, WordCard } from "@/components";
import { updateReviewTimes } from "../_server-actions";
import { TWordCard } from "../page";
import Loading from "@/app/loading";
import { insertActionLogs } from "@/components/exam/server-actions/insert-action-logs";

interface IProps {
    wordCards: TWordCard[]
}

function calculateElementsPerRow(parentWidth: number, childWidth = 280, minGap = 20) {
    // 如果容器宽度小于一个卡片宽度，则返回1
    if (parentWidth < childWidth) {
        return 1;
    }
    
    // 计算考虑最小间距后，最多能放几个卡片
    // 公式: n个卡片需要的总宽度 = n * childWidth + (n-1) * minGap <= parentWidth
    // 解方程: n * childWidth + (n-1) * minGap <= parentWidth
    // n * childWidth + n * minGap - minGap <= parentWidth
    // n * (childWidth + minGap) <= parentWidth + minGap
    // n <= (parentWidth + minGap) / (childWidth + minGap)
    const maxCards = Math.floor((parentWidth + minGap) / (childWidth + minGap));
    
    return Math.max(1, maxCards); // 至少返回1
}

function splitIntoRows<T>(wordList: T[], n: number) {
    const rows = [];
    for (let i = 0; i < wordList.length; i += n) {
        rows.push(wordList.slice(i, i + n));
    }
    return rows;
}

export function WordCards(props: IProps) {
    const { wordCards } = props;
    const router = useRouter();

    const [rows, setRows] = React.useState<TWordCard[][]>([]);
    const [cardInfo, setCardInfo] = React.useState<Prisma.memo_cardGetPayload<{}> | null>(null);
    const [showGlass, setShowGlass] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const cardWidthRef = React.useRef(280); // 卡片宽度
    const gapWidthRef = React.useRef(20);   // 最小间距
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        document.addEventListener("mouseup", (event) => {
            const target = event.target;
            if (target instanceof Node) {
                const inContainer =
                    target === containerRef.current
                    || containerRef.current?.contains(target);
                if (inContainer === false) {
                    setShowGlass(false);
                }
            }
        });
    }, []);

    React.useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (ref.current) {
                const containerWidth = ref.current.clientWidth;
                const cardWidth = cardWidthRef.current;
                const minGap = gapWidthRef.current;
                
                // 计算每行最多能放几个卡片
                const elementNumPerRow = calculateElementsPerRow(containerWidth, cardWidth, minGap);
                
                setRows(prev => {
                    const curRows = prev.flat().length ? prev.flat() : wordCards;
                    const next = splitIntoRows<TWordCard>(curRows, elementNumPerRow);
                    return next;
                });
            }
        });
        observer.observe(document.documentElement);

        return () => {
            observer.disconnect();
        };
    }, [wordCards]);

    // 计算每行卡片之间的实际间距
    const calculateGap = (containerWidth: number, cardsInRow: number, cardWidth: number) => {
        if (cardsInRow <= 1) return 0;
        return (containerWidth - cardsInRow * cardWidth) / (cardsInRow - 1);
    };

    async function handleRecognizeClick(id: string) {
        if (rows.length === 1 && rows[0].length === 1) {
            router.refresh();
        }
        // 1. 対応する要素を見つけて削除します。
        // 2. 要素が含まれる部分配列およびその後の部分配列を再配置する。
        setRows(prev => {
            if (prev.length === 1) {
                const updatedRow = prev[0].filter(item => item.id !== id);
                return [updatedRow];
            }
            const n = prev[0].length;
            const flattened = prev.flat();
            const updated = flattened.filter(item => item.id !== id);
            const next: TWordCard[][] = [];
            for (let i = 0; i < updated.length; i += n) {
                next.push(updated.slice(i, i + n));
            }
            return next;
        });
        await updateReviewTimes(id);
        insertActionLogs(id, $Enums.action_type_enum.COMPLETE_WORD_REVIEW, $Enums.related_type_enum.word_card);
    }

    function handleUnRecognizeClick(item: TWordCard) {
        setShowGlass(true);
        setCardInfo(item.memo_card);
        insertActionLogs(item.id, $Enums.action_type_enum.FORGOT_WORD_MEANING, $Enums.related_type_enum.word_card);
    }

    return (
        <>
            {
                rows.flat().length === 0 ? <Loading /> : null
            }
            {showGlass && cardInfo ? (
                <div className="fixed w-[100vw] h-[100vh] left-[0] top-[0] backdrop-blur-[3px] backdrop-saturate-[180%] overflow-scroll z-[10000]">
                    <div ref={containerRef} className="sm:w-[auto] sm:min-w-[46vw] w-full p-[22px] absolute max-h-[92%] overflow-auto left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 transform">
                        <MemoCard {...cardInfo} />
                    </div>
                </div>
            ) : null}
            <div ref={ref} className="w-full">
                {
                    rows.map((row, rowIdx) => {
                        // 获取容器宽度
                        const containerWidth = ref.current?.clientWidth || 0;
                        
                        // 使用第一行的卡片数量计算标准间距
                        // 这确保了所有行（包括最后一行）使用相同的间距
                        const maxCardsPerRow = rows[0].length;
                        const standardGap = calculateGap(containerWidth, maxCardsPerRow, cardWidthRef.current);
                        
                        // 判断是否是最后一行且卡片数量少于最大行
                        const isLastIncompleteRow = rowIdx === rows.length - 1 && row.length < maxCardsPerRow;
                        
                        return (
                            <div 
                                key={rowIdx} 
                                className="flex" 
                                style={{ 
                                    marginBottom: '20px',
                                    // 完整行使用space-between，最后一行不完整时使用flex-start
                                    justifyContent: isLastIncompleteRow ? 'flex-start' : 'space-between'
                                }}
                            >
                                {
                                    row.map((cardInfo, cardIdx) => (
                                        <div
                                            key={cardInfo.id}
                                            style={{ 
                                                width: `${cardWidthRef.current}px`,
                                                // 对于最后一行，每个卡片（除了最后一个）都添加固定的右边距
                                                // 对于其他行，space-between会自动处理间距
                                                marginRight: isLastIncompleteRow && cardIdx < row.length - 1 
                                                    ? `${standardGap}px` 
                                                    : undefined
                                            }}
                                        >
                                            <WordCard
                                                wordCardInfo={cardInfo}
                                                onRecognize={handleRecognizeClick}
                                                onUnRecognize={handleUnRecognizeClick}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        );
                    })
                }
            </div>
        </>
    )
}