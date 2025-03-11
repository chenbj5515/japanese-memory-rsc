"use client"
import React from "react";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { MemoCard } from "@/components";
import { Prisma } from '@prisma/client';
import { RootState } from "@/store";
import { useTranslations } from 'next-intl';
import LoadingButton from '@/components/ui/loading-button';
import { importSampleMemoCards } from "./server-actions"

interface IProps {
    memoCardsInitial: Prisma.memo_cardGetPayload<{}>[]
}

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export function MemoCards(props: IProps) {
    const { memoCardsInitial } = props;
    const [memoCards, setMemoCards] = React.useState(memoCardsInitial);
    const [isLoading, setIsLoading] = React.useState(false);
    const { localCards } = useTypedSelector((state: RootState) => state.localCardsSlice);
    const t = useTranslations('memoCards');

    function handleDelete(id: string) {
        setMemoCards(prev => prev.filter(card => card.id !== id));
    }

    async function handleImportSampleData() {
        try {
            setIsLoading(true);
            await importSampleMemoCards();
            window.location.reload();
        } catch (error) {
            console.error('导入示例数据失败:', error);
        }
    }

    return (
        <>
            {memoCards?.map(card => (
                <div className="memo-card sm:text-base text-[18px] mx-auto mb-14 max-w-92-675" key={card.id}>
                    <MemoCard {...card} onDelete={handleDelete} />
                </div>
            ))}
            {
                localCards.length === 0 && memoCards.length === 0 ? (
                    <div className="flex mt-[80px] items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-blue-800">
                        <div className="px-4 mx-auto text-center lg:px-8 sm:py-24 lg:py-32">
                            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-[2.2rem]">
                                {t('noDataFound')}
                            </h1>
                            <div className="mt-6 flex flex-col items-center gap-4">
                                {/* <p className="text-base leading-7 text-black dark:text-white">
                                    {t('enterJapanese')}
                                </p> */}
                                <LoadingButton
                                    onClick={handleImportSampleData}
                                    className="mt-2"
                                    isLoading={isLoading}
                                >
                                    {t('importSampleData')}
                                </LoadingButton>
                            </div>
                        </div>
                    </div>
                ) : null
            }
        </>
    )
}