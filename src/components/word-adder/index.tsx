"use client"
import React from "react";
import { readStreamableValue } from 'ai/rsc';
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { useRefState } from "@/hooks";
import { RootState } from "@/store";
import { askAI } from "@/server-actions";
import { insertWordCard } from "./server-actions";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export function WordCardAdder() {
    const [selectedTextRef, setSelectedText] = useRefState<string>("");
    const [{ left, top }, setPosition] = React.useState({
        left: 0,
        top: 0,
    });
    const meaningTextRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { cardId } = useTypedSelector((state: RootState) => state.cardIdSlice);

    async function handleSelectEvent() {
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            const selectedText = selection.toString().trim();
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (selectedText.length) {
                selectedTextRef.current = selectedText;
                setPosition({
                    left: rect.right,
                    top: rect.bottom,
                });
                try {
                    const { output } = await askAI(`这是一个日语单词或者短语：${selectedText}，注意不要说多余的废话，只需要按照这个格式输出：意味：这个单词或者短语的翻译结果`);
                    for await (const delta of readStreamableValue(output)) {
                        if (meaningTextRef.current && delta) {
                            meaningTextRef.current.textContent += delta;
                        }
                    }
                }
                catch (e) {
                }
            }
        }
    }

    function handleCloseContainer(event: MouseEvent) {
        if (event.target instanceof Node) {
            const inContainer =
                event.target === containerRef.current
                || containerRef.current?.contains(event.target);
            if (selectedTextRef.current && inContainer === false) {
                setSelectedText("");
            }
        }
    }

    React.useEffect(() => {
        document.addEventListener("mouseup", (event) => {
            handleSelectEvent();
            handleCloseContainer(event);
        });
    }, []);

    function handleAddWord() {
        if (meaningTextRef.current?.textContent) {
            insertWordCard(selectedTextRef.current, meaningTextRef.current.textContent, cardId);
            setSelectedText("");
        }
        window.getSelection()?.removeAllRanges();
    }

    return selectedTextRef.current ? (
        <div
            ref={containerRef}
            className="card max-w-[240px] z-[15] rounded-[6px] text-[15px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-3 mx-auto fixed"
            style={{ top, left }}
        >
            <div>单词・短语：{selectedTextRef.current}</div>
            <div
                contentEditable
                ref={meaningTextRef}
                className="whitespace-pre-wrap outline-none"
            ></div>
            <div className="flex justify-center mt-2">
                {" "}
                <button
                    className="bg-white text-black rounded-[10px] text-sm font-semibold py-2 px-4 cursor-pointer transition-all ease-in-out duration-300 border border-black shadow-none hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[1px_3px_0_0_black] active:translate-y-1 active:translate-x-0.5 active:shadow-none"
                    onClick={handleAddWord}
                >
                    加入到单词本
                </button>
            </div>{" "}
        </div>
    ) : null;
}
