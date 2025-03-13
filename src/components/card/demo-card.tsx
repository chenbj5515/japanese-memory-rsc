"use client"
import React from "react";
import { MemoCard } from "@/components/card/memo-card";
import { useTranslations } from "next-intl";
import { useAudioPermission } from "@/hooks/use-audio-permission";

type DemoCardProps = {
    type?: 'youtubeSubtitle' | 'netflixSubtitle' | 'contextText'
}

export function DemoCard({ type = 'youtubeSubtitle' }: DemoCardProps) {
    const t = useTranslations('memoCards')
    useAudioPermission();

    const demoDataMap = {
        youtubeSubtitle: {
            id: "",
            translation: t('demoTranslation1'),
            create_time: new Date("2025-02-24T16:30:57.848Z"),
            update_time: new Date("2025-02-24T16:31:17.123Z"),
            record_file_path: "",
            original_text: "それ聞くの野暮だよお",
            review_times: 0,
            user_id: "",
            kana_pronunciation: "それきくのやぼだよお",
            context_url: "https://www.youtube.com/watch?v=9dS3EKcvofQ&t=146",
            forget_count: 0
        },
        netflixSubtitle: {
            id: "",
            translation: t('demoTranslation3'),
            create_time: new Date("2025-02-24T16:30:57.848Z"),
            update_time: new Date("2025-02-24T16:31:17.123Z"),
            record_file_path: "",
            original_text: "福岡に美人が多いという噂は伝説でもなんでもなく、もはや定説と言ってもいいでしょう。",
            review_times: 0,
            user_id: "",
            kana_pronunciation: "ふくおかにびじんがおおいといううわさはでんせつでもなんでもなく、もはやていせつといってもいいでしょう。",
            context_url: "https://gokant-go.sawarise.co.jp/fukuoka-cute/?scrollY=1046&text=%25E7%25A6%258F%25E5%25B2%25A1%25E3%2581%25AB%25E7%25BE%258E%25E4%25BA%25BA%25E3%2581%258C%25E5%25A4%259A%25E3%2581%2584%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%25E5%2599%2582%25E3%2581%25AF%25E4%25BC%259D%25E8%25AA%25AC%25E3%2581%25A7%25E3%2582%2582%25E3%2581%25AA%25E3%2582%2593%25E3%2581%25A7%25E3%2582%2582%25E3%2581%25AA%25E3%2581%258F%25E3%2580%2581%25E3%2582%2582%25E3%2581%25AF%25E3%2582%2584%25E5%25AE%259A%25E8%25AA%25AC%25E3%2581%25A8%25E8%25A8%2580%25E3%2581%25A3%25E3%2581%25A6%25E3%2582%2582%25E3%2581%2584%25E3%2581%2584%25E3%2581%25A7%25E3%2581%2597%25E3%2582%2587%25E3%2581%2586%25E3%2580%2582",
            forget_count: 0
        },
        contextText: {
            id: "",
            translation: t('demoTranslation3'),
            create_time: new Date("2025-02-24T16:30:57.848Z"),
            update_time: new Date("2025-02-24T16:31:17.123Z"),
            record_file_path: "",
            original_text: "福岡に美人が多いという噂は伝説でもなんでもなく、もはや定説と言ってもいいでしょう。",
            review_times: 0,
            user_id: "",
            kana_pronunciation: "ふくおかにびじんがおおいといううわさはでんせつでもなんでもなく、もはやていせつといってもいいでしょう。",
            context_url: "https://gokant-go.sawarise.co.jp/fukuoka-cute/?scrollY=1046&text=%25E7%25A6%258F%25E5%25B2%25A1%25E3%2581%25AB%25E7%25BE%258E%25E4%25BA%25BA%25E3%2581%258C%25E5%25A4%259A%25E3%2581%2584%25E3%2581%25A8%25E3%2581%2584%25E3%2581%2586%25E5%2599%2582%25E3%2581%25AF%25E4%25BC%259D%25E8%25AA%25AC%25E3%2581%25A7%25E3%2582%2582%25E3%2581%25AA%25E3%2582%2593%25E3%2581%25A7%25E3%2582%2582%25E3%2581%25AA%25E3%2581%258F%25E3%2580%2581%25E3%2582%2582%25E3%2581%25AF%25E3%2582%2584%25E5%25AE%259A%25E8%25AA%25AC%25E3%2581%25A8%25E8%25A8%2580%25E3%2581%25A3%25E3%2581%25A6%25E3%2582%2582%25E3%2581%2584%25E3%2581%2584%25E3%2581%25A7%25E3%2581%2597%25E3%2582%2587%25E3%2581%2586%25E3%2580%2582",
            forget_count: 0
        }
    }

    return (
        <MemoCard
            {...demoDataMap[type]}
            onDelete={() => { }}
        />
    );
}
