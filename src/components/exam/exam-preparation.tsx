"use client"
import LoadingButton from '@/components/ui/loading-button';
import { useRouter } from "next/navigation"
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TooltipProvider } from '@/components/ui/tooltip';
import { createExam } from './server-actions/create-exam';
import { ExamItem } from "./exam-item";

export interface Exam {
    id: string
    date: string
    score: number
    duration: number // 单位：分钟
}

interface ExamMonth {
    month: string
    exams: Exam[]
}

interface IProps {
    examHistory: ExamMonth[];
}

export default function ExamPreparation(props: IProps) {
    const { examHistory } = props;
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    let isLocked = false;

    async function handleAgree() {
        if (isLocked) return;
        setIsLoading(true);
        isLocked = true;
        const recordStr = await createExam();
        const record = JSON.parse(recordStr);

        const query = new URLSearchParams({ id: record.exam_id }).toString();
        router.push(`/exam?${query}`);
    }

    if (examHistory.length === 0) {
        return (
            <div className="flex h-full justify-center">
                <div className="p-6 bg-white text-center mt-[140px]">
                    <h1 className="text-[2.2rem] font-bold text-gray-800 mb-4">試験を開始できません</h1>
                    <p className="text-gray-600 text-[16px]">
                        データが不足しています。試験を開始するには十分な日本語の文を入力してください。
                    </p>
                </div>
            </div>
        )
    }

    return (
        <TooltipProvider>
            <div className="max-w-[768px] m-auto p-4">
                <div className='flex w-full justify-center'>
                    <LoadingButton isLoading={isLoading} className="w-[240px] m-auto mb-6 py-[22px] text-[15px]" onClick={handleAgree}>
                        新しい試験を始める
                    </LoadingButton>
                </div>
                <h2 className="text-xl font-semibold mb-4">試験歴史</h2>
                <div className="rounded-md border p-4">
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {examHistory.map((monthData, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{monthData.month}</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-2">
                                        {monthData.exams.map((exam) => (
                                            <ExamItem exam={exam} key={exam.id} />
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </TooltipProvider>
    )
}
