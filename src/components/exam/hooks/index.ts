import { useRef, useEffect, useState } from "react";

export function useCountDowner() {
    const timeLeftRef = useRef(25 * 60);
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

interface IProps {
    onConfirm: () => void;
}

export function useFixConfirmDialog(props: IProps) {
    const { onConfirm } = props;
    const [currentQuestionNo, setCurrentQuestionNo] = useState<number | null>(null);

    return {
        isOpen: currentQuestionNo !== null,
        currentQuestionNo,
        handleFixClick: (itemNo: number) => {
            setCurrentQuestionNo(itemNo);
        },
        handleCancel: () => {
            setCurrentQuestionNo(null);
        },
        handleConfirm: () => {
            setCurrentQuestionNo(null);
            onConfirm();
        }
    };
}