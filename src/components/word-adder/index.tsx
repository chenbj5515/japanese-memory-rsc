"use client"
import React from "react";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { callChatApi } from "@/utils";
import { useRefState, useForceUpdate } from "@/hooks";
import { RootState } from "@/store";
import { insertWordCard } from "./server-actions";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export function WordCardAdder() {
    const [selectedText, setSelectedText] = useRefState<string>("");
    const [{ left, top }, setPosition] = React.useState({
        left: 0,
        top: 0,
    });
    const forceUpdate = useForceUpdate();
    const meaningTextRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { cardId } = useTypedSelector((state: RootState) => state.cardIdSlice);

    function handleSelectEvent() {
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
            }
        }
    }

    function handleCloseContainer(event: MouseEvent) {
        if (event.target instanceof Node) {
            const inContainer =
                event.target === containerRef.current
                || containerRef.current?.contains(event.target);
            if (selectedText.current && inContainer === false) {
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

    React.useEffect(() => {
        if (meaningTextRef.current) {
            meaningTextRef.current.textContent = "意味：";
        }
        if (selectedText.current.length) {
            callChatApi(selectedText.current, {
                onmessage(res: string) {
                    if (meaningTextRef.current) {
                        meaningTextRef.current.textContent += res;
                    }
                },
                async onclose() {
                    if (meaningTextRef.current) {
                        forceUpdate();
                    }
                },
                onerror() { },
                prompt:
                    "我会给你输入一个日文单词或者短语，请给出它的中文翻译结果。格式要求是仅输出翻译结果",
            });
        }
    }, [selectedText.current]);

    function handleAddWord() {
        if (meaningTextRef.current?.textContent) {
            insertWordCard(selectedText.current, meaningTextRef.current.textContent, cardId);
            setSelectedText("");
        }
    }

    return selectedText.current ? (
        <div
            ref={containerRef}
            className="card max-w-[240px] z-[15] rounded-[6px] text-[15px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-3 mx-auto fixed"
            style={{ top, left }}
        >
            <div>单词・短语：{selectedText.current}</div>
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
