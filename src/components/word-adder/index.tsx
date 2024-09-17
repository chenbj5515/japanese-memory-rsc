"use client"
import React from "react";
import { readStreamableValue } from 'ai/rsc';
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "@/store";
import { askAI } from "@/server-actions";
import { insertWordCard } from "./server-actions";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

// 1 知りたい単語を選択する
// 2 語句の翻訳結果を編集する（オプション）
// 3 追加ボタンを押して、単語帳に追加する
// 4 追加した後・WordCardAdder以外のDOM要素をクリックした後、WordCardAdderを非表示にする
export function WordCardAdder() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { cardId } = useTypedSelector((state: RootState) => state.cardIdSlice);

    const [{
        left,
        top,
        selectedText,
        meaningTextRef
    }, setState] = React.useState({
        left: 0,
        top: 0,
        selectedText: '',
        meaningTextRef: React.useRef<HTMLDivElement>(null),
    });

    function closeAction() {
        if (meaningTextRef.current) {
            meaningTextRef.current.textContent = "";
        }
        setState(prev => ({
            ...prev,
            top: -100,
            left: -100,
            selectedText: "",
        }))
    }

    async function selectTextAction(left: number, top: number, selected: string) {
        setState(prev => ({
            ...prev,
            left,
            top,
            selectedText: selected
        }))
        if (meaningTextRef.current) {
            const { output } = await askAI(`これは日本語の単語またはフレーズです：${selected}、それを中国語に翻訳してください、気をつけて原文とか余分な言葉を出さないで、翻訳結果だけを出してください。`);
            for await (const delta of readStreamableValue(output)) {
                if (meaningTextRef.current && delta) {
                    meaningTextRef.current.textContent += delta;
                }
            }
        }
    }

    async function handleSelectEvent() {
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            const selected = selection.toString().trim();
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (selected.length) {
                selectTextAction(rect.right, rect.bottom, selected);
            }
        }
    }

    React.useEffect(() => {
        function handleMouseUp(event: MouseEvent) {
            if (event.target instanceof Node) {
                const inContainer =
                    event.target === containerRef.current
                    || containerRef.current?.contains(event.target);
                if (!inContainer) {
                    handleSelectEvent();
                    if (selectedText) {
                        closeAction();
                    }
                }
            }
        }
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        }
    }, [selectedText]);

    function handleAddWord() {
        setState(prev => ({
            ...prev,
            top: -100,
            left: -100,
            selectedText: "",
        }))
        if (meaningTextRef.current?.textContent) {
            insertWordCard(selectedText, meaningTextRef.current.textContent, cardId);
        }
        if (meaningTextRef.current) {
            meaningTextRef.current.textContent = "";
        }
        window.getSelection()?.removeAllRanges();
    }

    return (
        <div
            ref={containerRef}
            className="card max-w-[240px] z-[15] rounded-[6px] text-[15px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-3 mx-auto fixed"
            style={{ top, left, visibility: selectedText ? "visible" : "hidden" }}
        >
            <div>語句：{selectedText}</div>
            <div className="flex">
                意味：
                <div
                    contentEditable
                    ref={meaningTextRef}
                    className="whitespace-pre-wrap outline-none"
                ></div>
            </div>

            <div className="flex justify-center mt-2">
                <button
                    className="bg-white text-black rounded-[10px] text-sm font-semibold py-2 px-4 cursor-pointer border border-black shadow-none hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[1px_3px_0_0_black] active:translate-y-1 active:translate-x-0.5 active:shadow-none"
                    onClick={handleAddWord}
                >
                    単語帳に追加
                </button>
            </div>
        </div>
    )
}
