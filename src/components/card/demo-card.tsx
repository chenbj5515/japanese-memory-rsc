"use client"
import React from "react";
import { MemoCard } from "@/components/card/memo-card";
import { useTranslations } from "next-intl";

export function DemoCard() {
    const t = useTranslations('memoCards')

    const demoData = {
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
    }

    return (
        <MemoCard
            {...demoData}
            onDelete={() => { }}
        />
    );
}
