import { Prisma } from "@prisma/client";
import { useState, useRef, useEffect } from "react";

// グローバルカードUIの表示を制御する
export function useModalCard<T = Prisma.memo_cardGetPayload<{}>>() {
    const [cardInfo, setCardInfo] = useState<T | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setCardInfo(null);
            }
        }

        if (cardInfo) {
            document.addEventListener('mouseup', handleClickOutside);
        } else {
            document.removeEventListener('mouseup', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
        };
    }, [cardInfo]);

    function openModalCard(info: T) {
        setCardInfo(info);
    }

    return {
        cardInfo,
        openModalCard,
        containerRef,
        handleSearch: (cardInfo: T) => {
            openModalCard(cardInfo);
        }
    };
}