'use client'

import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PlayCircle, Search } from 'lucide-react'
import { containsKanji, getDiff, speakText } from '@/utils'
import { askAI } from '@/server-actions'
import { readStreamableValue } from 'ai/rsc';
import { TWordCard } from '@/app/[locale]/word-cards/page'
import { $Enums, Prisma } from '@prisma/client'
import { Input } from "@/components/ui/input"
import { MemoCard } from '../card';
import { useModalCard } from '@/hooks/modal';
import { GlassModal } from '../glass-modal';
import { useCountDowner, useFixConfirmDialog } from './hooks';
import { QuestionInput } from './question-input';
import { FixConfirmDialog } from './fix-confirm-dialog';
import { mergeResultsByQuestion, checkAnswer } from './utils';
import { useEscToGoBack, useRefState } from '@/hooks';
import { useState } from 'react';
import LoadingButton from '../ui/loading-button';

type ExamResult = Omit<Prisma.exam_resultsGetPayload<{}>, "create_time">

export interface ExamInfo extends ExamResult {
    no: number;
    reference_answer: string;
    wordCard?: TWordCard | null;
    cardInfo?: Prisma.memo_cardGetPayload<{}> | null;
    inputs?: ExamInfo[];
    question_score: number;
    judging?: boolean;
    completed: boolean;
    judge_result?: string;
    create_time: string;
}

const INITIAL_RESULTS = [
    {
        "no": 0,
        "result_id": "",
        "exam_id": "",
        "question_type": "kana_from_japanese", 
        "question_ref": "",
        "question": "着実",
        "reference_answer": "",
        "user_answer": "",
        "is_correct": false,
        "wordCard": {
            "id": "",
            "word": "着実",
            "meaning": "意味：踏实、稳健",
            "create_time": "2024-07-11T05:33:10.527Z",
            "user_id": "",
            "review_times": 1,
            "memo_card_id": "",
            "memo_card": {
                "id": "",
                "translation": "然后，类型3是数据收集和制作资料之类让决定的事情稳健地正确地完成的人。",
                "create_time": "2024-07-09T00:09:20.448Z",
                "update_time": "2024-07-12T02:42:24.153Z",
                "record_file_path": null,
                "original_text": "それからタイプ３はデータ収集や資料作成など決められたことを着実に正確にやり遂げる人。",
                "review_times": 2,
                "user_id": "",
                "kana_pronunciation": "それからタイプ３はデータしゅうしゅうやしりょうさくせいなどきめられたことをちゃくじつにせいかくにやりとげるひと。",
                "source_video_url": null
            }
        },
        "question_score": 2,
        "judging": false,
        "completed": false
    },
    {
        "no": 1,
        "result_id": "",
        "exam_id": "",
        "question_type": "translation_from_japanese",
        "question_ref": "",
        "question": "着実",
        "reference_answer": "踏实、稳健",
        "user_answer": "",
        "is_correct": false,
        "wordCard": {
            "id": "",
            "word": "着実",
            "meaning": "意味：踏实、稳健",
            "create_time": "2024-07-11T05:33:10.527Z",
            "user_id": "",
            "review_times": 1,
            "memo_card_id": "",
            "memo_card": {
                "id": "",
                "translation": "然后，类型3是数据收集和制作资料之类让决定的事情稳健地正确地完成的人。",
                "create_time": "2024-07-09T00:09:20.448Z",
                "update_time": "2024-07-12T02:42:24.153Z",
                "record_file_path": null,
                "original_text": "それからタイプ３はデータ収集や資料作成など決められたことを着実に正確にやり遂げる人。",
                "review_times": 2,
                "user_id": "",
                "kana_pronunciation": "それからタイプ３はデータしゅうしゅうやしりょうさくせいなどきめられたことをちゃくじつにせいかくにやりとげるひと。",
                "source_video_url": null
            }
        },
        "question_score": 2,
        "judging": false,
        "completed": false
    },
    {
        "no": 18,
        "result_id": "",
        "exam_id": "",
        "question_type": "japanese_from_chinese",
        "question_ref": "",
        "question": "充足的/充裕的",
        "reference_answer": "たっぷり",
        "user_answer": "",
        "is_correct": false,
        "wordCard": {
            "id": "",
            "word": "たっぷり",
            "meaning": "意味：充足的/充裕的",
            "create_time": "2024-04-22T03:17:56.874Z",
            "user_id": "",
            "review_times": 1,
            "memo_card_id": "",
            "memo_card": {
                "id": "",
                "translation": "分量足的和风便当。",
                "create_time": "2024-04-22T00:17:34.992Z",
                "update_time": "2024-04-28T11:30:05.946Z",
                "record_file_path": null,
                "original_text": "ボリュウムたっぷりの和風弁当なんです。",
                "review_times": 3,
                "user_id": "",
                "kana_pronunciation": "ぼりゅうむたっぷりのわふうべんとうなんです。",
                "source_video_url": null
            }
        },
        "question_score": 4,
        "judging": false,
        "completed": false
    },
    {
        "no": 30,
        "result_id": "",
        "exam_id": "",
        "question_type": "transcription_from_audio",
        "question_ref": "",
        "question": "あと文化祭の準備の時に飲み物差し入れてくれたのもかっこよかった",
        "reference_answer": "あと文化祭の準備の時に飲み物差し入れてくれたのもかっこよかった",
        "user_answer": "",
        "is_correct": false,
        "cardInfo": {
            "id": "",
            "translation": "还有在文化节准备时给我们送来饮料，那也很帅气。",
            "create_time": "2025-01-13T11:37:38.211Z",
            "update_time": "2025-01-14T01:06:20.934Z",
            "record_file_path": "",
            "original_text": "あと文化祭の準備の時に飲み物差し入れてくれたのもかっこよかった",
            "review_times": 1,
            "user_id": "",
            "kana_pronunciation": "あとぶんかさいのじゅんびのときにのみものさしいれてくれたのもかっこよかった。",
            "source_video_url": "https://www.youtube.com/watch?v=CDNzs1Nr-FA&t=147"
        },
        "question_score": 4,
        "judging": false,
        "completed": false
    }
] as any as ExamInfo[];

export default function DemoExam() {
    const initialResults: ExamInfo[] = INITIAL_RESULTS;

    const { timerDisplayRef } = useCountDowner();

    // AIによって「不正解」と判定された問題を「正解」へと変更する操作を行う際に必要な確認ダイアログの表示・制御ロジック
    const { isOpen, currentQuestionNo, handleFixClick, handleConfirm, handleCancel } = useFixConfirmDialog({
        onConfirm: () => {
            setExamResults(examResultsRef.current.map(result =>
                result.no === currentQuestionNo
                    ? { ...result, is_correct: true, score: result.question_score }
                    : result
            ));
        },
    });

    const [loading, setLoading] = useState(false);

    // 問題に対応する日本語原文など情報をカード内に表示することを制御するロジック
    const { cardInfo, containerRef, handleSearch } = useModalCard<Prisma.memo_cardGetPayload<{}>>();

    // 初始化examResults
    const [examResultsRef, setExamResults] = useRefState<ExamInfo[]>(initialResults);

    const examResults = examResultsRef.current;

    const allCompleted = examResults.every(result => result.completed);

    // escキーを押して前のページに戻る
    useEscToGoBack();

    const q1List = mergeResultsByQuestion(
        examResults
            .filter(result =>
                result.question_type === $Enums.question_type_enum.kana_from_japanese ||
                result.question_type === $Enums.question_type_enum.translation_from_japanese)
    )

    const q2List = examResults.filter(result => result.question_type === $Enums.question_type_enum.japanese_from_chinese)

    const q3List = examResults.filter(result => result.question_type === $Enums.question_type_enum.transcription_from_audio)

    const handleCommit = async () => {
        if (loading) return;
        setLoading(true);
        await Promise.all(examResults.map(processExamResult));
    };

    // 通常の問題(音声問題以外)の採点処理
    const processNormalQuestion = async (result: ExamInfo) => {
        setExamResults(examResultsRef.current.map(item =>
            item.no === result.no ? { ...item, judging: true } : item
        ));

        let isCorrect = await checkAnswer(result.question, result.user_answer, result.question_type);
        let reference_answer = result.reference_answer;

        if (result.question_type === $Enums.question_type_enum.kana_from_japanese) {
            const aiResult = await getKanaFromAI(result.question);
            reference_answer = aiResult;
            isCorrect = result.user_answer === aiResult;
        }

        return {
            ...result,
            is_correct: isCorrect,
            reference_answer,
            judging: false,
            completed: true
        };
    };

    // 音声問題の採点処理
    const processAudioQuestion = async (result: ExamInfo) => {
        const { diff, htmlString } = getDiff(result.question || "", result.user_answer || "");
        const rightWordsLen = diff
            .filter(diffInfo => diffInfo[0] === 0)
            .reduce((acc, cur) => acc + cur[1].length, 0);

        const right = rightWordsLen > 0.8 * (result.question.length ?? 0);

        return {
            ...result,
            is_correct: right,
            reference_answer: result.question,
            judge_result: htmlString,
            completed: true
        };
    };

    // AIから仮名を取得
    const getKanaFromAI = async (question: string) => {
        const prompt = `「${question}」这个短语的平假名读音是什么？请只给我平假名读音不要输出任何其他内容。`;
        const { output } = await askAI(prompt, 0.9);
        let aiResult = "";
        for await (const delta of readStreamableValue(output)) {
            if (delta) aiResult += delta;
        }
        return aiResult;
    };

    // 各問題の採点処理
    const processExamResult = async (result: ExamInfo) => {
        const next = result.question_type === $Enums.question_type_enum.transcription_from_audio
            ? await processAudioQuestion(result)
            : await processNormalQuestion(result);

        setExamResults(examResultsRef.current.map(item =>
            item.no === result.no ? next : item
        ));

        return next;
    };

    const handleInputChange = (index: number, value: string) => {
        setExamResults(
            examResultsRef.current.map((result) =>
                result.no === index ? { ...result, user_answer: value } : result
            )
        );
    };

    function handlePlay(original_text: string) {
        original_text && speakText(original_text, {
            voicerName: "ja-JP-NanamiNeural",
        });
    }

    // 自定义样式类
    const customCardStyle = "!border !border-solid !border-[#1d283a]";

    return (
        <div className="relative font-NewYork container w-[640px] mx-auto bg-gray-50 min-h-screen pt-[14px]">
            <h1 className='font-bold text-[24px] text-center'>試験</h1>
            {/* カウントダウン */}
            {
                !allCompleted ? (
                    <div
                        ref={timerDisplayRef}
                        className="p-2 inset-0 flex items-center justify-center text-xl font-medium tabular-nums"
                    >
                        25:00
                    </div>
                ) : null
            }
            <div className="space-y-8 mt-[10px]">
                {/* 翻訳・読み */}
                <Card className={customCardStyle}>
                    <CardHeader className="p-4">
                        <CardTitle className="text-[18px]">翻訳・読み</CardTitle>
                    </CardHeader>
                    {q1List.map((group, index) => (
                        <CardContent key={index} className="space-y-6">
                            <div>
                                <div className='flex items-center'>
                                    <Label className="text-[15px]">{index + 1}.「{group.question}」</Label>
                                    {group.inputs?.every(inputInfo => inputInfo.completed) ? (
                                        <Search
                                            className="cursor-pointer text-[#999]-500 hover:text-blue-500 ml-2"
                                            size={20}
                                            onClick={() => handleSearch(group.wordCard?.memo_card!)}
                                        />
                                    ) : null}
                                </div>
                                {group.inputs?.map(inputInfo => (
                                    <QuestionInput
                                        key={inputInfo.no}
                                        inputInfo={inputInfo}
                                        disabled={inputInfo.completed}
                                        placeholder={inputInfo.question_type === $Enums.question_type_enum.kana_from_japanese ? "平假名を入力してください" : "中国語で入力してください"}
                                        onChange={(val) => handleInputChange(inputInfo.no, val)}
                                        onFixClick={() => handleFixClick(inputInfo.no)}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    ))}
                </Card>

                {/* 日本語への翻訳 */}
                <Card className={customCardStyle}>
                    <CardHeader className="p-4">
                        <CardTitle className="text-[18px]">日本語への翻訳</CardTitle>
                    </CardHeader>
                    {q2List.map((result, index) => (
                        <CardContent key={index} className="space-y-6">
                            <div>
                                <div className='flex items-center'>
                                    <Label className="text-[15px]">{index + 1}.「{result.question}」</Label>
                                    {result.completed ? (
                                        <Search
                                            className="cursor-pointer text-[#999]-500 hover:text-blue-500 ml-2"
                                            size={20}
                                            onClick={() => handleSearch(result.wordCard?.memo_card!)}
                                        />
                                    ) : null}
                                </div>
                                <QuestionInput
                                    inputInfo={result}
                                    disabled={result.completed}
                                    placeholder="日本語で入力してください"
                                    onChange={(val) => handleInputChange(result.no, val)}
                                    onFixClick={() => handleFixClick(result.no)}
                                />
                            </div>
                        </CardContent>
                    ))}
                </Card>

                {/* 聴解問題 */}
                <Card className={customCardStyle}>
                    <CardHeader className="p-4">
                        <CardTitle className="text-[18px]">聴解問題</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {q3List.map((result, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-start mb-4">
                                    <Button onClick={() => handlePlay(result.question)} variant="outline" size="icon">
                                        <PlayCircle className="h-6 w-6" />
                                        <span className="sr-only">音声を再生</span>
                                    </Button>
                                    <span className="ml-2 text-[15px]">問題 {index + 1}</span>
                                    {result.completed && (
                                        <Search
                                            className="cursor-pointer text-[#999]-500 hover:text-blue-500 ml-4"
                                            size={20}
                                            onClick={() => handleSearch(result.cardInfo!)}
                                        />
                                    )}
                                </div>
                                {
                                    result.completed ? (
                                        <div className="ml-2 text-[15px] p-2" dangerouslySetInnerHTML={{ __html: result.judge_result! }}></div>
                                    ) : (
                                        <Input
                                            id={result.no.toString()}
                                            placeholder="日本語で入力してください"
                                            autoComplete="off"
                                            className="mt-2"
                                            value={result.user_answer}
                                            onChange={(e) => handleInputChange(result.no, e.target.value)}
                                        />
                                    )
                                }
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {
                !allCompleted && (
                    <div className='flex justify-center mt-[24px] mb-[20px]'>
                        <LoadingButton isLoading={loading} onClick={handleCommit} className="w-[120px] text-md px-6 py-5">
                            提出
                        </LoadingButton>
                    </div>
                )
            }

            {/* 問題対応する原文をチェックする */}
            <GlassModal open={Boolean(cardInfo)} containerRef={containerRef}>
                {cardInfo && <MemoCard {...cardInfo} />}
            </GlassModal>

            {/* AIの判定を修正する前のチェックダイアログ */}
            <FixConfirmDialog
                open={isOpen}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div >
    );
}
