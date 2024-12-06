'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlayCircle, CheckCircle, XCircle, Search, Wrench } from 'lucide-react'
import { containsKanji, speakText } from '@/utils'
import { askAI } from '@/server-actions'
import { readStreamableValue } from 'ai/rsc';
import { TWordCard } from '@/app/word-cards/page'
import { Prisma } from '@prisma/client'
import diff_match_patch from 'diff-match-patch';
import { MemoCard } from '../card';
import { insertExamResults } from './server-actions/insert-exam-result';
import { updateExamResult } from './server-actions/update-exam-result';

interface IProps {
    wordCards: TWordCard[]
    randomShortCards: Prisma.memo_cardGetPayload<{}>[]
}

enum QuestionType {
    KanaFromJapanese = "kana_from_japanese",
    TranslationFromJapanese = "translation_from_japanese",
    JapaneseFromChinese = "japanese_from_chinese",
    TranscriptionFromAudio = "transcription_from_audio"
}

interface ExamResult {
    result_id: string | null; // UUID or null before saving
    exam_id: string | null; // UUID or null before associating with an exam
    question_type: QuestionType; // Type of question
    question_ref: string; // Reference to word_card or memo_card ID
    question: string; // The question text
    reference_answer: string; // The correct answer
    user_answer: string; // The user's answer
    is_correct: boolean; // Whether the answer is correct
    score: number; // The score for the question
    create_time: string | null; // ISO timestamp or null before saving
}
interface ExamInfo extends ExamResult {
    no: number;
    wordCard?: TWordCard;
    cardInfo?: Prisma.memo_cardGetPayload<{}>;
    inputs?: ExamInfo[];
    question_score: number;
}

function useCountDowner() {
    const timeLeftRef = useRef(25 * 60); // 25 minutes in seconds
    const timerDisplayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeLeftRef.current <= 1) {
                clearInterval(timer);
                timeLeftRef.current = 0;
            } else {
                timeLeftRef.current -= 1;
            }
            if (timerDisplayRef.current) {
                const minutes = Math.floor(timeLeftRef.current / 60);
                const seconds = timeLeftRef.current % 60;
                timerDisplayRef.current.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return { timeLeftRef, timerDisplayRef }
}

function mergeResultsByQuestion(results: ExamInfo[]) {
    const questionMap = new Map();

    results.forEach(result => {
        const { question, wordCard } = result;

        if (questionMap.has(question)) {
            questionMap.get(question).inputs.push(result);
        } else {
            questionMap.set(question, {
                question,
                wordCard,
                inputs: [result],
            });
        }
    });

    return Array.from(questionMap.values()) as ExamInfo[];
}

function handlePlay(original_text: string) {
    original_text && speakText(original_text, {
        voicerName: "ja-JP-NanamiNeural",
    });
}

export default function NewExam(props: IProps) {
    const { wordCards, randomShortCards } = props;
    const { timerDisplayRef } = useCountDowner();

    // 初始化符合 Exam_Results 表结构的状态
    const [examResults, setExamResults] = useState<ExamInfo[]>(() => {
        const initialResults: ExamInfo[] = [];
        let no = 0;

        // 日本語から中国語への翻訳
        wordCards.slice(0, 10).forEach((wordCard) => {
            if (containsKanji(wordCard.word)) {
                initialResults.push({
                    no: no++,
                    result_id: null,
                    exam_id: null,
                    question_type: QuestionType.KanaFromJapanese,
                    question_ref: wordCard.id,
                    question: wordCard.word,
                    reference_answer: '', // 可在评估时填充
                    user_answer: '',
                    is_correct: false,
                    score: 0,
                    create_time: null,
                    wordCard,
                    question_score: 2
                });
                initialResults.push({
                    no: no++,
                    result_id: null,
                    exam_id: null,
                    question_type: QuestionType.TranslationFromJapanese,
                    question_ref: wordCard.id,
                    question: wordCard.word,
                    reference_answer: wordCard.meaning.replace("意味：", ""),
                    user_answer: '',
                    is_correct: false,
                    score: 0,
                    create_time: null,
                    wordCard,
                    question_score: 2
                });
            } else {
                initialResults.push({
                    no: no++,
                    result_id: null,
                    exam_id: null,
                    question_type: QuestionType.TranslationFromJapanese,
                    question_ref: wordCard.id,
                    question: wordCard.word,
                    reference_answer: wordCard.meaning.replace("意味：", ""),
                    user_answer: '',
                    is_correct: false,
                    score: 0,
                    create_time: null,
                    wordCard,
                    question_score: 4
                });
            }
        });

        // 中国語から日本語への翻訳
        wordCards.slice(10).forEach((wordCard) => {
            initialResults.push({
                no: no++,
                result_id: null,
                exam_id: null,
                question_type: QuestionType.JapaneseFromChinese,
                question_ref: wordCard.id,
                question: wordCard.meaning.replace("意味：", ""),
                reference_answer: wordCard.word,
                user_answer: '',
                is_correct: false,
                score: 0,
                create_time: null,
                wordCard,
                question_score: 4
            });
        });

        // 聴解問題
        randomShortCards.forEach((cardInfo) => {
            initialResults.push({
                no: no++,
                result_id: null,
                exam_id: null,
                question_type: QuestionType.TranscriptionFromAudio,
                question_ref: cardInfo.id as string,
                question: cardInfo.original_text || '',
                reference_answer: cardInfo.original_text || '',
                user_answer: '',
                is_correct: false,
                score: 0,
                create_time: null,
                cardInfo,
                question_score: 4
            });
        });

        return initialResults;
    });

    const [completed, setCompleted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [curResultNo, setResultNo] = useState<number | null>(null);

    const handleInputChange = (index: number, value: string) => {
        setExamResults((prevResults) =>
            prevResults.map((result) =>
                result.no === index ? { ...result, user_answer: value } : result
            )
        );
    };

    const q1List = mergeResultsByQuestion(
        examResults
            .filter(result => result.question_type === QuestionType.KanaFromJapanese || result.question_type === QuestionType.TranslationFromJapanese)
    )
    const q2List = examResults.filter(result => result.question_type === QuestionType.JapaneseFromChinese);
    const q3List = examResults.filter(result => result.question_type === QuestionType.TranscriptionFromAudio);
    const score = examResults.reduce((acc, cur) => acc + cur.score, 0);

    const handleCommit = async () => {
        setCompleted(true);

        const updatedResults = await Promise.all(
            examResults.map(async (result) => {
                let next = result;
                if (result.question_type !== QuestionType.TranscriptionFromAudio) {
                    let isCorrect = result.user_answer === result.reference_answer;
                    if (!isCorrect) {
                        isCorrect = await checkAnswer(result.question, result.user_answer, result.question_type);
                    }
                    let reference_answer = result.reference_answer;
                    if (result.question_type === QuestionType.KanaFromJapanese) {
                        const prompt = `「${result.question}」这个短语的平假名读音是什么？请只给我平假名读音不要输出任何其他内容。`
                        const { output } = await askAI(prompt, 0.9);
                        let aiResult = "";
                        for await (const delta of readStreamableValue(output)) {
                            if (delta) aiResult += delta;
                        }
                        reference_answer = aiResult;
                        isCorrect = result.user_answer === aiResult;
                    }

                    const score = isCorrect ? result.question_score : 0;

                    next = {
                        ...result,
                        is_correct: isCorrect,
                        score,
                        reference_answer
                    };
                }
                else {
                    const dmp = new diff_match_patch();

                    const diff = dmp.diff_main(
                        result.question || "",
                        result.user_answer || ""
                    );
                    const htmlString = diff.map(([result, text]) => {
                        return `<span class="${result === -1
                            ? "text-wrong w-full break-words pointer-events-none"
                            : result === 1
                                ? "text-correct w-full break-words pointer-events-none"
                                : "w-full break-words pointer-events-none"
                            }">${text}</span>`;
                    }).join("");

                    const rightWordsLen = diff
                        .filter(diffInfo => diffInfo[0] === 1)
                        .reduce((acc, cur) => acc + cur[1].length, 0);

                    const right = rightWordsLen > 0.9 * (result.question.length ?? 0)
                    next = {
                        ...result,
                        is_correct: right,
                        score: right ? 4 : 0,
                        reference_answer: htmlString
                    };
                }
                setExamResults(prev => prev.map(item => item.no === result.no ? next : item));
                return next;
            })
        )

        const { insertedResults } = await insertExamResults(updatedResults) as any;
        if (insertedResults) {
            setExamResults(updatedResults.map((item, index) => ({
                ...item,
                ...insertedResults[index]
            })))
        }
    };

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

    function onFixClick(no: number) {
        setResultNo(no);
        setIsOpen(true);
    }

    const handleConfirm = () => {
        setIsOpen(false);
        setExamResults(examResults.map(result => result.no === curResultNo ? ({
            ...result,
            is_correct: true,
            feedback: "正解！",
            score: result.question_score,
        }) : result));

        const updatedResult = examResults.filter(result => result.no === curResultNo)[0];
        updateExamResult(updatedResult);
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    async function checkAnswer(question: string, userAnswer: string, type: QuestionType): Promise<boolean> {
        const prompt = type === QuestionType.KanaFromJapanese
            ? `「${question}」的平假名读音是「${userAnswer}」吗？返回true或false。`
            : type === QuestionType.TranslationFromJapanese
                ? `「${question}」对应的中文如果翻译为「${userAnswer}」你觉得可以算对吗？只返回true或false。`
                : `「${question}」对应的日文如果翻译为「${userAnswer}」你觉得可以算对吗？返回true或false。`;

        const { output } = await askAI(prompt, 0.9);
        let result = "";
        for await (const delta of readStreamableValue(output)) {
            if (delta) result += delta;
        }
        return result.trim() === "true";
    }

    return (
        <div className="p-5 relative font-NewYork container w-[680px] mx-auto bg-gray-50 min-h-screen">
            <h1 className='font-bold text-[24px] text-center'>試験</h1>
            {
                !completed ? (
                    <div
                        ref={timerDisplayRef}
                        className="p-2 inset-0 flex items-center justify-center text-xl font-medium tabular-nums"
                    >
                        25:00
                    </div>
                ) : null
            }
            {
                completed ? (
                    <div className='absolute w-[260px] top-[6px] -right-[360px]'>
                        <div
                            style={{ marginLeft: score.toString().length === 1 ? "46px" : "16px" }}
                            className='text-wrong w-[160px] h-[142px] -rotate-6 text-[112px] top'
                        >{score}</div>
                        <Image
                            className='absolute'
                            src="/lines.png"
                            width="246"
                            height="82"
                            alt='line'
                        />
                    </div>
                ) : null
            }
            <div className="space-y-8 mt-[20px]">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[18px]">翻訳・読み</CardTitle>
                    </CardHeader>
                    {
                        q1List.map((result, index) => (
                            <CardContent key={index} className="space-y-6">
                                <div>
                                    <div className='flex items-center'>
                                        <Label className="text-[15px]">{index + 1}.「{result.question}」</Label>
                                        {
                                            completed ? (
                                                <Search
                                                    className="cursor-pointer text-gray-500 hover:text-blue-500 ml-2"
                                                    size={20}
                                                    onClick={() => handleSearch(result.wordCard?.memo_card!)}
                                                />
                                            ) : null
                                        }
                                    </div>
                                    {
                                        result.inputs?.map(inputInfo => (
                                            <div key={inputInfo.no}>
                                                {
                                                    inputInfo.question_type === QuestionType.KanaFromJapanese ? (
                                                        <>
                                                            <Input
                                                                id={inputInfo.no.toString()}
                                                                placeholder="平假名を入力してください"
                                                                className="mt-2"
                                                                disabled={completed}
                                                                autoComplete="off"
                                                                value={inputInfo.user_answer || ""}
                                                                onChange={(e) => handleInputChange(inputInfo.no, e.target.value)}
                                                            />
                                                            {completed ? (
                                                                <div className="mt-2 flex items-center">
                                                                    {inputInfo.is_correct ? (
                                                                        <CheckCircle color="#32CD32" className="h-5 w-5 text-green-500 mr-2" />
                                                                    ) : (
                                                                        <XCircle color="#E50914" className="h-5 w-5 text-red-500 mr-2" />
                                                                    )}
                                                                    <span className="text-sm">
                                                                        {inputInfo.is_correct ? "正解！" : `参考答案：${inputInfo.reference_answer}`}
                                                                    </span>
                                                                    {
                                                                        inputInfo.user_answer ? (
                                                                            <Wrench
                                                                                className="cursor-pointer text-gray-500 hover:text-yellow-500 ml-4"
                                                                                size={20}
                                                                                onClick={() => onFixClick(inputInfo.no)}
                                                                            />
                                                                        ) : null
                                                                    }
                                                                </div>
                                                            ) : null}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Input
                                                                id={inputInfo.no.toString()}
                                                                placeholder="中国語で入力してください"
                                                                disabled={completed}
                                                                autoComplete="off"
                                                                className="mt-2"
                                                                value={inputInfo.user_answer}
                                                                onChange={(e) => handleInputChange(inputInfo.no, e.target.value)}
                                                            />
                                                            {completed && (
                                                                <div className="mt-2 flex items-center">
                                                                    {inputInfo.is_correct ? (
                                                                        <CheckCircle color="#32CD32" className="h-5 w-5 text-green-500 mr-2" />
                                                                    ) : (
                                                                        <XCircle color="#E50914" className="h-5 w-5 text-red-500 mr-2" />
                                                                    )}
                                                                    <span className="text-sm">
                                                                        {inputInfo.is_correct ? "正解！" : `参考答案：${inputInfo.reference_answer}`}
                                                                    </span>
                                                                    {
                                                                        inputInfo.user_answer ? (
                                                                            <Wrench
                                                                                className="cursor-pointer text-gray-500 hover:text-yellow-500 ml-4"
                                                                                size={20}
                                                                                onClick={() => onFixClick(inputInfo.no)}
                                                                            />
                                                                        ) : null
                                                                    }
                                                                </div>
                                                            )}
                                                        </>
                                                    )
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            </CardContent>
                        ))
                    }
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[18px]">日本語への翻訳</CardTitle>
                    </CardHeader>
                    {
                        q2List.map((result, index) => (
                            <CardContent key={index} className="space-y-6">
                                <div>
                                    <div className='flex items-center'>
                                        <Label className="text-[15px]">{index + 1}.「{result.question}」</Label>
                                        {
                                            completed ? (
                                                <Search
                                                    className="cursor-pointer text-gray-500 hover:text-blue-500 ml-2"
                                                    size={20}
                                                    onClick={() => handleSearch(result.wordCard?.memo_card!)}
                                                />
                                            ) : null
                                        }
                                    </div>
                                    <Input
                                        placeholder="日本語で入力してください"
                                        disabled={completed}
                                        autoComplete="off"
                                        className="mt-2"
                                        value={result.user_answer}
                                        onChange={(e) => handleInputChange(result.no, e.target.value)}
                                    />
                                    {completed && (
                                        <div className="mt-2 flex items-center">
                                            {result.is_correct ? (
                                                <CheckCircle color="#32CD32" className="h-5 w-5 text-green-500 mr-2" />
                                            ) : (
                                                <XCircle color="#E50914" className="h-5 w-5 text-red-500 mr-2" />
                                            )}
                                            <span className="text-sm">
                                                {result.is_correct ? "正解！" : `参考答案：${result.reference_answer}`}
                                            </span>
                                            {
                                                result.user_answer ? (
                                                    <Wrench
                                                        className="cursor-pointer text-gray-500 hover:text-yellow-500 ml-4"
                                                        size={20}
                                                        onClick={() => onFixClick(result.no)}
                                                    />
                                                ) : null
                                            }
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        ))
                    }
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[18px]">聴解問題</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {
                            q3List.map((result, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-start mb-4">
                                        <Button onClick={() => handlePlay(result.question)} variant="outline" size="icon">
                                            <PlayCircle className="h-6 w-6" />
                                            <span className="sr-only">音声を再生</span>
                                        </Button>
                                        <span className="ml-2 text-[15px]">問題 {index + 1}</span>
                                        {
                                            completed ? (
                                                <Search
                                                    className="cursor-pointer text-gray-500 hover:text-blue-500 ml-4"
                                                    size={20}
                                                    onClick={() => handleSearch(result.cardInfo!)}
                                                />
                                            ) : null
                                        }
                                    </div>

                                    {completed ? (
                                        <div className="ml-2 text-[15px] p-2" dangerouslySetInnerHTML={{ __html: result.reference_answer }}></div>
                                    ) : (
                                        <>
                                            <Label htmlFor={result.no.toString()}>聞いた文を入力してください：</Label>
                                            <Input
                                                id={result.no.toString()}
                                                placeholder="日本語で入力してください"
                                                autoComplete="off"
                                                className="mt-2"
                                                value={result.user_answer}
                                                onChange={(e) => handleInputChange(result.no, e.target.value)}
                                            />
                                        </>

                                    )}
                                </div>
                            ))
                        }
                    </CardContent>
                </Card>
            </div>
            {
                !completed && (
                    <div className='flex justify-center mt-[42px] mb-[20px]'>
                        <Button onClick={handleCommit} size="sm" className="w-[120px] text-md px-6 py-5">
                            提出
                        </Button>
                    </div>
                )
            }
            {showGlass && cardInfo ? (
                <div className="fixed w-[100vw] h-[100vh] left-[0] top-[0] backdrop-blur-[3px] backdrop-saturate-[180%] overflow-scroll z-[10000]">
                    <div ref={containerRef} className="sm:w-[auto] sm:min-w-[46vw] w-full p-[22px] absolute max-h-[92%] overflow-auto left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
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
        </div >
    );
}
