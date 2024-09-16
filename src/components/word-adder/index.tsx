"use client"
import React from "react";
import { readStreamableValue } from 'ai/rsc';
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { useForceUpdate, useRefState } from "@/hooks";
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
    const forceUpdate = useForceUpdate();

    async function handleSelectEvent() {
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            const selectedText = selection.toString().trim();
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (selectedText.length) {
                setSelectedText(selectedText);
                setPosition({
                    left: rect.right,
                    top: rect.bottom,
                });

                try {
                    if (meaningTextRef.current) {
                        meaningTextRef.current.textContent += "意味："
                        const { output } = await askAI(`これは日本語の単語またはフレーズです：${selectedText}、それを中国語に翻訳してください、気をつけて原文とか余分な言葉を出さないで、翻訳結果だけを出してください。`);
                        for await (const delta of readStreamableValue(output)) {
                            if (meaningTextRef.current && delta) {
                                meaningTextRef.current.textContent += delta;
                            }
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

    return (
        <div
            ref={containerRef}
            className="card max-w-[240px] z-[15] rounded-[6px] text-[15px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-3 mx-auto fixed"
            style={{ top, left, visibility: selectedTextRef.current ? "visible" : "hidden" }}
        >
            <div>単語・フレーズ：{selectedTextRef.current}</div>
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
                    単語帳に追加
                </button>
            </div>{" "}
        </div>
    )
}
