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
import { insertExamResults } from './server-actions/insert-exam-result';
import { updateExamResult } from './server-actions/update-exam-result';
import { useModalCard } from '@/hooks/modal';
import { GlassModal } from '../glass-modal';
import { useCountDowner, useFixConfirmDialog } from './hooks';
import { QuestionInput } from './question-input';
import { FixConfirmDialog } from './fix-confirm-dialog';
import { mergeResultsByQuestion, checkAnswer } from './utils';
import { updateExamStatus } from './server-actions/update-exam';
import { useEscToGoBack, useRefState } from '@/hooks';
import { useState } from 'react';
import LoadingButton from '../ui/loading-button';
import { insertActionLogs } from './server-actions/insert-action-logs';

interface IProps {
    initialResults: ExamInfo[];
    id: string
}

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
}

export default function NewExam(props: IProps) {
    const { initialResults, id } = props;
    const { timerDisplayRef } = useCountDowner();

    // AIによって「不正解」と判定された問題を「正解」へと変更する操作を行う際に必要な確認ダイアログの表示・制御ロジック
    const { isOpen, currentQuestionNo, handleFixClick, handleConfirm, handleCancel } = useFixConfirmDialog({
        onConfirm: () => {
            setExamResults(examResultsRef.current.map(result =>
                result.no === currentQuestionNo
                    ? { ...result, is_correct: true, score: result.question_score }
                    : result
            ));

            const score = examResultsRef.current.reduce((acc, cur) => acc + (cur.is_correct ? cur.question_score : 0), 0)
            const updatedResult = examResultsRef.current.find(result => result.no === currentQuestionNo);
            if (updatedResult?.result_id) {
                updateExamResult(id, updatedResult?.result_id, score);
            }
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

    const score = examResults.reduce((acc, cur) => acc + (cur.is_correct ? cur.question_score : 0), 0)

    const handleCommit = async () => {
        if (loading) return;
        setLoading(true);
        const updatedResults = await Promise.all(examResults.map(processExamResult));
        await updateExamStatus(id, $Enums.exam_status_enum.completed);
        const { insertedResults } = await insertExamResults(updatedResults, score) as any;
        
        if (insertedResults) {
            setExamResults(updatedResults.map((item, index) => ({
                ...item,
                ...insertedResults[index],
            })));
        }
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

        if (!isCorrect && result.wordCard?.id) {
            logIncorrectAnswer(result);
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
        const {diff, htmlString} = getDiff(result.question || "", result.user_answer || "");
        const rightWordsLen = diff
            .filter(diffInfo => diffInfo[0] === 0)
            .reduce((acc, cur) => acc + cur[1].length, 0);

        const right = rightWordsLen > 0.8 * (result.question.length ?? 0);
        
        if (!right && result.cardInfo?.id) {
            insertActionLogs(
                result.cardInfo.id, 
                $Enums.action_type_enum.UNABLE_TO_UNDERSTAND_AUDIO,
                $Enums.related_type_enum.memo_card
            );
        }

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

    // 不正解時のアクションログ記録
    const logIncorrectAnswer = async (result: ExamInfo) => {
        const actionType = result.question_type === $Enums.question_type_enum.kana_from_japanese
            ? $Enums.action_type_enum.FORGOT_WORD_PRONUNCIATION
            : result.question_type === $Enums.question_type_enum.translation_from_japanese 
                ? $Enums.action_type_enum.FORGOT_WORD_MEANING
                : $Enums.action_type_enum.UNKNOWN_PHRASE_EXPRESSION;

        await insertActionLogs(
            result.wordCard!.id,
            actionType,
            $Enums.related_type_enum.word_card
        );
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

    return (
        <div className="p-5 relative font-NewYork container w-[680px] mx-auto bg-gray-50 min-h-screen">
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
            {/* 点数 */}
            {
                allCompleted ? (
                    <div className='absolute w-[260px] top-[6px] -right-[360px]'>
                        <div
                            style={{ marginLeft: score.toString().length === 1 ? "46px" : "16px" }}
                            className='text-wrong w-[160px] h-[142px] -rotate-6 text-[112px]'
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
                {/* 翻訳・読み */}
                <Card>
                    <CardHeader>
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
                <Card>
                    <CardHeader>
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
                <Card>
                    <CardHeader>
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
                    <div className='flex justify-center mt-[42px] mb-[20px]'>
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
