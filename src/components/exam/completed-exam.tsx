'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from 'next/image';
import diff_match_patch from 'diff-match-patch';
import { Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlayCircle, CheckCircle, XCircle } from 'lucide-react'
import { containsKanji, speakText } from '@/utils'
import { askAI } from '@/server-actions'
import { readStreamableValue } from 'ai/rsc';
import { TWordCard } from '@/app/word-cards/page'
import { Prisma } from '@prisma/client'
import { MemoCard } from '../card';

interface IProps {
    resultData: string
}

type Answer = {
    userInputValue?: string;
    word: string;
    isCorrect: boolean;
    feedback: string;
    correctAnswer: string;
    score: number;
    totalScore: number;
    question: string;
};

type Q1Type = {
    question: string;
    answers: Answer[];
};

type Q2Type = {
    question: string;
    answers: Answer[];
};

type Q3Type = {
    score: number;
    feedback: string;
    question: string;
};

type InputData = Record<string, any>;

type Result = {
    q1: Q1Type[];
    q2: Q2Type[];
    q3: Q3Type[];
};

function transformData(data: InputData): Result {
    const q1: Record<string, Q1Type> = {};
    const q2: Record<string, Q2Type> = {};
    const q3: Q3Type[] = [];

    for (const [key, value] of Object.entries(data)) {
        if (key.startsWith("q1")) {
            const baseKey = key.split("-").slice(0, 2).join("-");
            if (!q1[baseKey]) {
                q1[baseKey] = { question: value.question, answers: [] };
            }
            q1[baseKey].answers.push(value as Answer);
        } else if (key.startsWith("q2")) {
            const baseKey = key.split("-").slice(0, 2).join("-");
            if (!q2[baseKey]) {
                q2[baseKey] = { question: value.question, answers: [value as Answer] };
            }
        } else if (key.startsWith("q3")) {
            q3.push(value as Q3Type);
        }
    }

    return {
        q1: Object.values(q1),
        q2: Object.values(q2),
        q3
    };
}

// 示例数据
const data: InputData = {
    "q3-0-listening": {
        score: 0,
        feedback: "<span class=\"text-wrong w-full break-words pointer-events-none\">じゃ、明日の朝、早めに来て取り掛かろう。</span>",
        question: "じゃ、明日の朝、早めに来て取り掛かろう。"
    },
    "q1-0-chinese": {
        userInputValue: "",
        word: "莫大な",
        isCorrect: false,
        feedback: "参考答案: 巨大的",
        correctAnswer: "巨大的",
        score: 0,
        totalScore: 2,
        question: "莫大な"
    },
    "q1-0-hiragana": {
        userInputValue: "",
        word: "莫大な",
        isCorrect: false,
        feedback: "参考答案: ばくだいな",
        correctAnswer: "ばくだいな",
        score: 0,
        totalScore: 2,
        question: "莫大な"
    },
    "q2-0-japanese": {
        userInputValue: "",
        word: "あるまじき",
        isCorrect: false,
        feedback: "参考答案: あるまじき",
        correctAnswer: "あるまじき",
        score: 0,
        totalScore: 4,
        question: "意味：不应该的"
    }
};

// 调用方法
const result = transformData(data);
console.log(result);


export default function CompletedExam(props: IProps) {
    const { resultData } = props;

    const parsedResultData = transformData(JSON.parse(resultData));
    const score = Object.keys(JSON.parse(resultData)).reduce((acc, cur) => acc + JSON.parse(resultData)[cur].score, 0);

    function handlePlay(original_text: string) {
        original_text && speakText(original_text, {
            voicerName: "ja-JP-NanamiNeural",
        });
    }

    const [cardInfo, setCardInfo] = useState<Prisma.memo_cardGetPayload<{}> | null>(null);
    const [showGlass, setShowGlass] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
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

    function handleSearch(cardInfo: Prisma.memo_cardGetPayload<{}>) {
        setCardInfo(cardInfo);
        setShowGlass(true);
    }

    const [curKey, setCurKey] = useState("");

    function onFixClick(key: string) {
        setCurKey(key);
        setIsOpen(true);
    }

    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        setIsOpen(false);
        setReviewResults((prev: any) => ({
            ...prev,
            [curKey]: {
                ...prev[curKey],
                isCorrect: true,
                feedback: "正解！",
                score: prev[curKey].totalScore,
            },
        }));
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    return (
        <div className="p-5 relative font-NewYork container w-[680px] mx-auto bg-gray-50 min-h-screen">
            <h1 className='font-bold text-[24px] text-center'>試験</h1>
            <div className='absolute w-[360px] top-[6px] -right-[440px]'>
                <div
                    style={{ marginLeft: score.toString().length === 1 ? "46px" : "16px" }}
                    className='text-wrong h-[142px] -rotate-6 text-[112px] top'
                >{score}</div>
                <Image
                    className='absolute'
                    src="/lines.png"
                    width="246"
                    height="82"
                    alt='line'
                />
            </div>
            <div className="space-y-8 mt-[20px]">
                {/* 日本語から中国語への翻訳 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[18px]">日本語から中国語への翻訳</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {
                            parsedResultData.q1.slice(0, 10).map((q1Item, index) => {
                                // const keyHiragana = `q1-${index}-hiragana`;
                                // const keyChinese = `q1-${index}-chinese`;

                                return (
                                    <div key={index}>
                                        <div className='flex items-center'>
                                            <Label className="text-[15px]">{index + 1}.「{q1Item.question}」</Label>
                                            <Search
                                                className="cursor-pointer text-gray-500 hover:text-blue-500 ml-2"
                                                size={20}
                                                onClick={() => handleSearch(wordCard.memo_card)}
                                            />
                                        </div>
                                        {
                                            containsKanji(wordCard.word) && (
                                                <>
                                                    <Input
                                                        id={keyHiragana}
                                                        placeholder="平假名を入力してください"
                                                        className="mt-2"
                                                        disabled
                                                        autoComplete="off"
                                                        value={inputValues[keyHiragana] || ""}
                                                    />
                                                    {reviewResults[keyHiragana] && (
                                                        <div className="mt-2 flex items-center">
                                                            {reviewResults[keyHiragana].isCorrect ? (
                                                                <CheckCircle color="#32CD32" className="h-5 w-5 text-green-500 mr-2" />
                                                            ) : (
                                                                <XCircle color="#E50914" className="h-5 w-5 text-red-500 mr-2" />
                                                            )}
                                                            <span className="text-sm">
                                                                {reviewResults[keyHiragana].feedback}
                                                            </span>
                                                            <Wrench
                                                                className="cursor-pointer text-gray-500 hover:text-yellow-500 ml-4"
                                                                size={20}
                                                                onClick={() => onFixClick(keyHiragana)}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )
                                        }
                                        <Input
                                            id={keyChinese}
                                            placeholder="中国語で入力してください"
                                            disabled
                                            autoComplete="off"
                                            className="mt-2"
                                            value={inputValues[keyChinese] || ""}
                                        />
                                        {reviewResults[keyChinese] && (
                                            <div className="mt-2 flex items-center">
                                                {reviewResults[keyChinese].isCorrect ? (
                                                    <CheckCircle color="#32CD32" className="h-5 w-5 text-green-500 mr-2" />
                                                ) : (
                                                    <XCircle color="#E50914" className="h-5 w-5 text-red-500 mr-2" />
                                                )}
                                                <span className="text-sm">
                                                    {reviewResults[keyChinese].feedback}
                                                </span>
                                                <Wrench
                                                    className="cursor-pointer text-gray-500 hover:text-yellow-500 ml-4"
                                                    size={20}
                                                    onClick={() => onFixClick(keyChinese)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        }
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8 mt-[40px]">
                {/* 中国語から日本語への翻訳 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[18px]">中国語から日本語への翻訳</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {
                            wordCards.slice(10).map((wordCard, index) => {
                                const keyJapanese = `q2-${index}-japanese`;

                                return (
                                    <div key={index}>
                                        <div className='flex items-center'>
                                            <Label htmlFor={keyJapanese} className="text-[15px]">{index + 1}.「{wordCard.meaning.replace("意味：", "")}」</Label>
                                            <Search
                                                className="cursor-pointer text-gray-500 hover:text-blue-500 ml-2"
                                                size={20}
                                                onClick={() => handleSearch(wordCard.memo_card)}
                                            />
                                        </div>
                                        <Input
                                            id={keyJapanese}
                                            placeholder="日本語で入力してください"
                                            disabled
                                            autoComplete="off"
                                            className="mt-2"
                                            value={inputValues[keyJapanese] || ""}
                                        />
                                        {reviewResults[keyJapanese] && (
                                            <div className="mt-2 flex items-center">
                                                {reviewResults[keyJapanese].isCorrect ? (
                                                    <CheckCircle color="#32CD32" className="h-5 w-5 text-green-500 mr-2" />
                                                ) : (
                                                    <XCircle color="#E50914" className="h-5 w-5 text-red-500 mr-2" />
                                                )}
                                                <span className="text-sm">
                                                    {reviewResults[keyJapanese].feedback}
                                                </span>
                                                <Wrench
                                                    className="cursor-pointer text-gray-500 hover:text-yellow-500 ml-4"
                                                    size={20}
                                                    onClick={() => onFixClick(keyJapanese)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        }
                    </CardContent>
                </Card>
            </div>
            {/* 聴解問題 */}
            <div className="space-y-8 mt-[40px]">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[18px]">聴解問題</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {
                            randomShortCards.map((cardInfo, index) => {
                                const keyListening = `q3-${index}-listening`;
                                return (
                                    <div key={index}>
                                        <div className="flex items-center justify-start mb-4">
                                            <Button onClick={() => handlePlay(cardInfo.original_text ?? "")} variant="outline" size="icon">
                                                <PlayCircle className="h-6 w-6" />
                                                <span className="sr-only">音声を再生</span>
                                            </Button>
                                            <span className="ml-2 text-[15px]">問題 {index + 1}</span>
                                            {
                                                compeleted ? (
                                                    <Search
                                                        className="cursor-pointer text-gray-500 hover:text-blue-500 ml-4"
                                                        size={20}
                                                        onClick={() => handleSearch(cardInfo)}
                                                    />
                                                ) : null
                                            }
                                        </div>

                                        <div className="ml-2 text-[15px] p-2" dangerouslySetInnerHTML={{ __html: reviewResults[keyListening].feedback }}></div>
                                    </div>
                                )
                            })
                        }
                    </CardContent>
                </Card>
            </div>
            {showGlass && cardInfo ? (
                <div className="fixed w-[100vw] h-[100vh] left-[0] top-[0] backdrop-blur-[3px] backdrop-saturate-[180%] overflow-scroll z-[10000]">
                    <div ref={containerRef} className="sm:w-[auto] sm:min-w-[46vw] w-full p-[22px] absolute max-h-[92%] overflow-auto left-[50%] top-[50%] center">
                        <MemoCard {...cardInfo} />
                    </div>
                </div>
            ) : null}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader className='p-3'>
                        <DialogTitle>この結果は正しいと確信されていますか？</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button className='w-[100px]' variant="default" onClick={handleConfirm}>
                            はい
                        </Button>
                        <Button variant="secondary" onClick={handleCancel}>
                            キャンセル
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}