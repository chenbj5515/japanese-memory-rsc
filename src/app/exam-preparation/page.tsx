"use client"
import LoadingButton from '@/components/ui/loading-button';
import { startExam } from '@/store/exam-state-slice'
import { useDispatch } from 'react-redux'
import { useRouter } from "next/navigation"
import { insertMemoCard } from "./_server-actions"
import { useState } from 'react';

let isLocked = false;

export default function Component() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();

    async function handleAgree() {
        if (isLocked) return;
        setIsLoading(true);
        // isLocked = true;      
        // const recordStr = await insertMemoCard();
        // const record = JSON.parse(recordStr);

        // const query = new URLSearchParams({ id: record.id }).toString();
        // dispatch(
        //     startExam()
        // );
        // router.push(`/exam?${query}`);
    }

    return (
        <div className="flex pt-[200px] flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200 text-center">
                試験を始める準備はできましたか？
            </h1>
            <LoadingButton isLoading={isLoading} onClick={handleAgree}>
                はい
            </LoadingButton>
        </div>
    )
}