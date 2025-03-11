"use client"
import React from "react";
import { MemoCard } from "@/components/card/memo-card";

export function DemoCard() {
    const demoData = {
        id: "4b2c5418-6076-489e-8ee7-e7b643b260e8",
        translation: "问这个就太无聊了。",
        create_time: new Date("2025-02-24T16:30:57.848Z"),
        update_time: new Date("2025-02-24T16:31:17.123Z"),
        record_file_path: "",
        original_text: "それ聞くの野暮だよお",
        review_times: 0,
        user_id: "15813a9c-0624-48e2-a2e2-73a26d357deb",
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
