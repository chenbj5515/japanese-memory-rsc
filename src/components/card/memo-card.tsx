"use client"
import React from "react";
import { Prisma } from '@prisma/client';
import { useDispatch } from "react-redux";
import { setCardId } from "@/store/card-id-slice";
import { getTimeAgo, speakText } from "@/utils";
import { Dictation } from "@/components/dictation";
import { useTripleRightClick } from "@/hooks";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { deleteMemoCard, updateMemoCardTranslation, updatePronunciation, updateOriginalText } from "./server-actions";
import { useAudioRecorder } from "@/hooks/audio";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

export function MemoCard(props: Prisma.memo_cardGetPayload<{}> & {
    onDelete?: (id: string) => void;
}) {
    const { translation, kana_pronunciation, original_text, create_time, id, context_url, onDelete } = props;

    const [recorderPressed, setRecorderPressedState] = React.useState(false);
    const [recordPlayBtnPressed, setRecordPlayBtnPressed] = React.useState(false);

    const [isFocused, setIsFocused] = React.useState(false);

    const translationTextRef = React.useRef<HTMLDivElement>(null);
    const originalTextRef = React.useRef<HTMLDivElement>(null);
    const prevTranslationTextRef = React.useRef<string>("");
    const kanaTextRef = React.useRef<HTMLDivElement>(null);
    const prevKanaTextRef = React.useRef<string>("");
    const pathname = usePathname();

    const dispatch = useDispatch();

    const { startRecording, stopRecording, playRecording } = useAudioRecorder();

    const cardRef = useTripleRightClick(async () => {
        onDelete?.(id);
        await deleteMemoCard(id);
    })

    function handleBlurChange(type: string) {
        setIsFocused(type === "blur" ? false : true);
    }

    React.useEffect(() => {
        if (cardRef.current) {
            cardRef.current.addEventListener("mouseup", () => {
                dispatch(
                    setCardId(id)
                )
            });
        }
    }, []);

    function handlePlayBtn() {
        original_text && speakText(original_text, {
            voicerName: "ja-JP-NanamiNeural",
        });
    }

    function handleRecordBtnClick() {
        setRecorderPressedState((prev) => !prev);
        if (recorderPressed) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    function handleRecordPlayBtnClick() {
        setRecordPlayBtnPressed((prev) => !prev);
        playRecording();
    }

    function handleFocus() {
        prevTranslationTextRef.current = translationTextRef.current?.textContent || "";
    }

    async function handleBlur() {
        if (translationTextRef.current?.textContent && translationTextRef.current?.textContent !== prevTranslationTextRef.current) {
            if (!pathname.includes('/home') && !pathname.includes('/guide')) {
                updateMemoCardTranslation(id, translationTextRef.current?.textContent)
            }
        }
    }

    function handleOriginalTextBlur() {
        if (originalTextRef.current?.textContent && !pathname.includes('/home') && !pathname.includes('/guide')) {
            updateOriginalText(id, originalTextRef.current?.textContent?.slice(3))
        }
    }

    function hanldeKanaFocus() {
        prevKanaTextRef.current = kanaTextRef.current?.textContent || "";
    }

    async function handleKanaBlur() {
        if (kanaTextRef.current?.textContent && kanaTextRef.current?.textContent !== prevKanaTextRef.current) {
            if (!pathname.includes('/home') && !pathname.includes('/guide')) {
                updatePronunciation(id, kanaTextRef.current?.textContent)
            }
        }
    }

    return (
        <Card
            ref={cardRef}
            className="border border-black p-5 relative leading-[1.9] tracking-[1.5px]"
        >
            <div className="sm:text-[14px] text-[16px] absolute -top-[30px] left-1 text-[#999]">
                {create_time ? getTimeAgo(create_time.toString()) : ""}
            </div>
            {/* 朗読ボタン */}
            {context_url ? (
                <>
                    {context_url.includes("youtube") || context_url.includes("netflix") ? (
                        <a
                            href={context_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-solid border border-black play-button-bg dark:bg-bgDark dark:shadow-none rounded-[50%] w-12 h-12 absolute top-2 right-2 cursor-pointer flex items-center justify-center"
                        >
                            {
                                context_url.includes("youtube") ? (
                                    <div className="w-[27px] h-5 overflow-hidden flex items-center justify-center relative">
                                        <img
                                            src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg"
                                            alt="read icon"
                                            className="w-4 scale-[4.5] left-[25px]"
                                            style={{ position: 'relative' }}
                                        />
                                    </div>
                                ) : (
                                    <img
                                        src="data:image/png;base64,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"
                                        alt="read icon"
                                        className="w-4 overflow-hidden"
                                    />
                                )
                            }
                        </a>
                    ) : (
                        <>
                            <div className="group absolute top-2 right-2">
                                <div className="relative w-12 pb-[68px]">
                                    <div
                                        className="border-solid border border-black play-button-bg dark:bg-bgDark dark:shadow-none rounded-full w-12 h-12 cursor-pointer transition-all duration-300 bg-white flex items-center justify-center relative z-10"
                                        onClick={handlePlayBtn}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            height="20"
                                            width="24"
                                        >
                                            <path
                                                clipRule="evenodd"
                                                d="M11.26 3.691A1.2 1.2 0 0 1 12 4.8v14.4a1.199 1.199 0 0 1-2.048.848L5.503 15.6H2.4a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 1.2 0 0 1 1.2-1.2h3.103l4.449-4.448a1.2 1.2 0 0 1 1.308-.26Zm6.328-.176a1.2 1.2 0 0 1 1.697 0A11.967 11.967 0 0 1 22.8 12a11.966 11.966 0 0 1-3.515 8.485 1.2 1.2 0 0 1-1.697-1.697A9.563 9.563 0 0 0 20.4 12a9.565 9.565 0 0 0-2.812-6.788 1.2 1.2 0 0 1 0-1.697Zm-3.394 3.393a1.2 1.2 0 0 1 1.698 0A7.178 7.178 0 0 1 18 12a7.18 7.18 0 0 1-2.108 5.092 1.2 1.2 0 1 1-1.698-1.698A4.782 4.782 0 0 0 15.6 12a4.78 4.78 0 0 0-1.406-3.394 1.2 1.2 0 0 1 0-1.698Z"
                                                fillRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="w-12 h-12 rounded-full border border-black transition-all duration-300 opacity-0 absolute top-0 left-0 group-hover:opacity-100 group-hover:translate-y-14 bg-white hover:bg-gray-100 flex items-center justify-center"
                                        onClick={() => window.open(context_url, "_blank")}
                                    >
                                        <ExternalLink className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div
                    className="border-solid border border-black play-button-bg dark:bg-bgDark dark:shadow-none rounded-[50%] w-12 h-12 absolute top-2 right-2 cursor-pointer"
                    onClick={handlePlayBtn}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        height="20"
                        width="24"
                        className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"
                    >
                        <path
                            clipRule="evenodd"
                            d="M11.26 3.691A1.2 1.2 0 0 1 12 4.8v14.4a1.199 1.199 0 0 1-2.048.848L5.503 15.6H2.4a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 1.2 0 0 1 1.2-1.2h3.103l4.449-4.448a1.2 1.2 0 0 1 1.308-.26Zm6.328-.176a1.2 1.2 0 0 1 1.697 0A11.967 11.967 0 0 1 22.8 12a11.966 11.966 0 0 1-3.515 8.485 1.2 1.2 0 0 1-1.697-1.697A9.563 9.563 0 0 0 20.4 12a9.565 9.565 0 0 0-2.812-6.788 1.2 1.2 0 0 1 0-1.697Zm-3.394 3.393a1.2 1.2 0 0 1 1.698 0A7.178 7.178 0 0 1 18 12a7.18 7.18 0 0 1-2.108 5.092 1.2 1.2 0 1 1-1.698-1.698A4.782 4.782 0 0 0 15.6 12a4.78 4.78 0 0 0-1.406-3.394 1.2 1.2 0 0 1 0-1.698Z"
                            fillRule="evenodd"
                        ></path>
                    </svg>
                </div>
            )}
            <div className="flex mb-[28px]">
                <div
                    suppressContentEditableWarning
                    contentEditable
                    className="relative outline-none w-[calc(100%-42px)]"
                    onBlur={handleOriginalTextBlur}
                    ref={originalTextRef}
                >
                    原文：
                    {isFocused ? (
                        <section
                            className={`rounded-lg absolute ${isFocused ? "backdrop-blur-[3px] backdrop-saturate-[180%]" : ""
                                }  w-[101%] h-[105%] -left-[4px] -top-[2px]`}
                        ></section>
                    ) : null}
                    <span className="original-text">{original_text}</span>
                </div>
            </div>
            翻訳：
            <div
                suppressContentEditableWarning
                contentEditable
                ref={translationTextRef}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="font-Default whitespace-pre-wrap pr-[42px] outline-none leading-[3]"
            >
                {translation}
            </div>
            読み：
            <div
                suppressContentEditableWarning
                contentEditable
                ref={kanaTextRef}
                onFocus={hanldeKanaFocus}
                onBlur={handleKanaBlur}
                className="whitespace-pre-wrap pr-[42px] outline-none leading-[3]"
            >
                {kana_pronunciation}
            </div>
            <div className="flex justify-center mt-3 relative cursor-pointer">
                {/* 录音ボタン */}
                <div className="group inline-block relative w-[40px] h-[40px] mr-[30px]">
                    <i className="ri-mic-fill z-[10] absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"></i>
                    <input
                        checked={recorderPressed}
                        onChange={handleRecordBtnClick}
                        type="checkbox"
                        className="peer opacity-0 cursor-pointer h-full w-full left-0 top-0 double-click absolute z-[11]"
                    />
                    <span className="border-[#1d283a] peer-checked:dark:shadow-darkActive peer-active:dark:filter-blurHalf peer-active:dark:shadow-darkActive peer-checked:filter-blurHalf peer-checked:shadow-buttonActive group-active:filter-blurHalf group-active:shadow-custom absolute left-1/2 top-1/2 bg-white border rounded-[68.8px] block transition-all duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] dark:shadow-none dark:bg-bgDark w-[50px] h-[50px] -translate-x-1/2 -translate-y-1/2"></span>
                </div>
                {/* 录音プレーボタン */}
                <div className="inline-block relative w-[40px] h-[40px] group">
                    <i className="text-[22px] ri-play-circle-fill z-[10] absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"></i>
                    <input
                        checked={recordPlayBtnPressed}
                        onChange={handleRecordPlayBtnClick}
                        type="checkbox"
                        className="peer opacity-0 cursor-pointer h-full w-full left-0 top-0 absolute z-[11]"
                    />
                    <span className="border-[#1d283a] peer-active:dark:shadow-darkActive group-active:filter-blurHalf group-active:shadow-buttonActive absolute left-1/2 top-1/2 bg-white border rounded-[68.8px] block transition-all duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] dark:shadow-none dark:bg-bgDark w-[50px] h-[50px] -translate-x-1/2 -translate-y-1/2"></span>
                </div>
            </div>
            <div className="relative flex flex-col mt-2">
                {
                    original_text ? (
                        <Dictation
                            originalText={original_text}
                            cardID={id}
                            onBlurChange={handleBlurChange}
                        />
                    ) : null
                }
            </div>
        </Card>
    );
}
