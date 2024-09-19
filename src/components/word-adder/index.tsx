"use client"
import React from "react";
import { readStreamableValue } from 'ai/rsc';
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "@/store";
import { askAI } from "@/server-actions";
import { insertWordCard } from "./server-actions";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

type StateType = {
    state: 'initial' | 'selected' | 'edited' | 'added' | 'closed';
    left: number;
    top: number;
    selectedText: string;
};

type Action =
    | { type: 'select'; payload: { left: number; top: number; selectedText: string } }
    | { type: 'edit'; payload: { selectedText: string } }
    | { type: 'addToWordCards' }
    | { type: 'close' };

const initialState: StateType = {
    state: 'initial',
    left: 0,
    top: 0,
    selectedText: '',
};

function reducer(state: StateType, action: Action): StateType {
    switch (action.type) {
        case 'select':
            return {
                ...state,
                state: 'selected',
                left: action.payload.left,
                top: action.payload.top,
                selectedText: action.payload.selectedText,
            };
        case 'edit':
            return {
                ...state,
                state: 'edited',
                selectedText: action.payload.selectedText,
            };
        case 'addToWordCards':
            return {
                ...state,
                state: 'added',
                left: -100,
                top: -100,
                selectedText: '',
            };
        case 'close':
            return {
                ...state,
                state: 'closed',
                left: -100,
                top: -100,
                selectedText: '',
            };
        default:
            return state;
    }
}

// 1 知りたい単語を選択する
// 2 語句の翻訳結果を編集する（オプション）
// 3 追加ボタンを押して、単語帳に追加する
// 4 追加した後・WordCardAdder以外のDOM要素をクリックした後、WordCardAdderを非表示にする
export function WordCardAdder() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { cardId } = useTypedSelector((state: RootState) => state.cardIdSlice);

    const meaningTextRef = React.useRef<HTMLDivElement>(null);
    const [{
        state,
        left,
        top,
        selectedText,
    }, dispatch] = React.useReducer(reducer, initialState);

    function effectCleanMeaningTextContent() {
        if (meaningTextRef.current) {
            meaningTextRef.current.textContent = "";
        }
    }

    function effectCleanElementSelected() {
        window.getSelection()?.removeAllRanges();
    }

    async function effectGetMeaning() {
        if (meaningTextRef.current) {
            const { output } = await askAI(`これは日本語の単語またはフレーズです：${selectedText}、それを中国語に翻訳してください、気をつけて原文とか余分な言葉を出さないで、翻訳結果だけを出してください。`);
            for await (const delta of readStreamableValue(output)) {
                if (meaningTextRef.current && delta) {
                    meaningTextRef.current.textContent += delta;
                }
            }
        }
    }

    async function effectInsertWordCard() {
        if (meaningTextRef.current?.textContent) {
            insertWordCard(selectedText, meaningTextRef.current.textContent, cardId);
        }
    }

    React.useEffect(() => {
        if (state === "selected") {
            effectGetMeaning();
        }
        if (state === "added") {
            effectInsertWordCard();
            effectCleanMeaningTextContent();
            effectCleanElementSelected();
        }
        if (state === "closed") {
            effectCleanMeaningTextContent();
            effectCleanElementSelected();
        }
    }, [state]);

    async function handleSelectEvent() {
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            const selected = selection.toString().trim();
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (selected.length) {
                dispatch({
                    type: "select",
                    payload: {
                        left: rect.right,
                        top: rect.bottom,
                        selectedText: selected
                    }
                })
            }
        }
    }

    React.useEffect(() => {
        function handleMouseUp(event: MouseEvent) {
            if (event.target instanceof Node) {
                const inContainer =
                    event.target === containerRef.current
                    || containerRef.current?.contains(event.target);
                // ポップアップ内でマウスがクリックした場合、何もしない
                if (!inContainer) {
                    if (selectedText) {
                        // もし現在ポップアップが表示されている場合、これを「close」イベントとして扱います
                        dispatch({
                            type: "close",
                        })
                    }
                    if (!selectedText && document.getSelection()) {
                        // 現在ポップアップが表示されておらず、かつ文字が選択されている場合は、これを「select」イベントとして扱います
                        handleSelectEvent();
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
        dispatch({
            type: "addToWordCards"
        })
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
