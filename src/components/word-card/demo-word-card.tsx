"use client"
import { WordCard } from "./index";
import { TWordCard } from "@/app/[locale]/word-cards/page";

// 默认单词卡数据
const defaultWordCardInfo: TWordCard = {
    "id": "27e8dc19-23c5-4e5f-8a6d-d19ece50baa7",
    "word": "捻じ曲げろ",
    "meaning": "扭曲，曲解",
    "create_time": new Date("2025-02-08T14:03:03.631Z"),
    "user_id": "",
    "review_times": 1,
    "memo_card_id": "ce158482-798c-4380-bba9-b742f05f1404",
    "forget_count": 0,
    "memo_card": {
        "id": "ce158482-798c-4380-bba9-b742f05f1404",
        "translation": "你是说要我因为私人情感扭曲事实吗？",
        "create_time": new Date("2025-02-08T14:02:46.828Z"),
        "update_time": new Date("2025-02-12T08:57:52.715Z"),
        "record_file_path": "",
        "original_text": "え、私情で真相捻じ曲げろって事ですか？",
        "review_times": 0,
        "user_id": "",
        "kana_pronunciation": "え、わたしじょうでしんそうねじまげろってことですか？",
        "context_url": "https://www.youtube.com/watch?v=QrwxVi9hWJg&t=374",
        "forget_count": 0
    }
};

interface DemoWordCardProps {
    onUnRecognize?: (wordCardInfo: TWordCard) => void;
    onRecognize?: (id: string) => void;
}

export function DemoWordCard({ onUnRecognize, onRecognize }: DemoWordCardProps = {}) {
    // 模拟回调函数
    const handleRecognize = (wordCardInfo: TWordCard) => {
    };

    const handleUnRecognize = (wordCardInfo: TWordCard) => {
        console.log('未认识单词:', wordCardInfo.word);
        // 如果传入了外部的onUnRecognize回调，则调用它
        onUnRecognize?.(wordCardInfo);
    };

    return (
        <WordCard 
            wordCardInfo={defaultWordCardInfo}
            onRecognize={handleRecognize}
            onUnRecognize={handleUnRecognize}
        />
    );
}

// 导出默认单词卡数据，以便外部访问
export { defaultWordCardInfo };
