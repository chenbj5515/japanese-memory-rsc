"use client"
import React from "react";
import { Prisma } from '@prisma/client';
import { useDispatch } from "react-redux";
import { setCardId } from "@/store/card-id-slice";
import { getTimeAgo, speakText } from "@/utils";
import { Dictation } from "@/components/dictation";
import { trpc } from '@/trpc/client'
import { useLongPress } from "@/hooks";
import { deleteMemoCard } from "./server-actions";
import { useRecorder } from "./hooks";

export function MemoCard(props: Prisma.memo_cardGetPayload<{}> & {
    setMemoCards: any
}) {
    const { translation, kana_pronunciation, original_text, record_file_path, create_time, id, setMemoCards } = props;
    const [recorderPressed, setRecorderPressedState] = React.useState(false);
    const [recordPlayBtnPressed, setRecordPlayBtnPressed] = React.useState(false);
    const audioRef = React.useRef<any>();
    const [recorderLoading, setRecordedLoading] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const translationTextRef = React.useRef<any>(null);
    const prevTranslationTextRef = React.useRef<any>(null);
    const kanaTextRef = React.useRef<any>(null);
    const prevKanaTextRef = React.useRef<any>(null);
    const dispatch = useDispatch();

    const updateKanaPronunciation = trpc.updateKanaPronunciation.useMutation();
    const updateTraslation = trpc.updateTraslation.useMutation();
    const cardRef = useLongPress(async () => {
        setMemoCards((prev: any) => prev.filter((card: any) => card.id !== id));
        await deleteMemoCard(id);
    })

    function handleBlurChange(type: string) {
        setIsFocused(type === "blur" ? false : true);
    }

    const { mediaRecorderRef } = useRecorder({
        async onEnd(recordedChunks) {
            setRecordedLoading(true);
            const audioBlob = new Blob(recordedChunks, { type: "audio/acc" });
            const formData = new FormData();
            const timeStamp = new Date().getTime();
            const recordFileName = `${id}${timeStamp}.mp3`;
            // const recordFileName = `${cardID}${timeStamp}.acc`;
            formData.append("audio", audioBlob, recordFileName);
            await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const audio = document.createElement("audio");
            audio.src = `http://localhost:8080/uploads/${recordFileName}`;
            // audio.src = `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUKET}/${cardID}${timeStamp}.acc`;
            audioRef.current = audio;
            setRecordedLoading(false);
        },
    });

    React.useEffect(() => {
        const audio = document.createElement("audio");
        audio.src = record_file_path || "";
        audioRef.current = audio;
        
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
            mediaRecorderRef.current?.stop();
        } else {
            mediaRecorderRef.current?.start();
        }
    }

    function handleRecordPlayBtnClick() {
        setRecordPlayBtnPressed((prev) => !prev);
        audioRef.current?.play();
    }

    function handleFocus() {
        prevTranslationTextRef.current = translationTextRef.current.textContent;
    }

    async function handleBlur() {
        if (translationTextRef.current.textContent !== prevTranslationTextRef.current) {
            const updatedRecord = await updateTraslation.mutateAsync({
                id,
                translation: translationTextRef.current.textContent
            });
        }
    }

    function hanldeKanaFocus() {
        prevKanaTextRef.current = kanaTextRef.current.textContent;
    }

    async function handleKanaBlur() {
        if (kanaTextRef.current.textContent !== prevKanaTextRef.current) {
            const updatedRecord = await updateKanaPronunciation.mutateAsync({
                id,
                kana_pronunciation: kanaTextRef.current.textContent
            });
        }
    }

    return (
        <div
            ref={cardRef}
            className="card rounded-[20px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-5 width-92-675 mx-auto mt-10 relative leading-[1.9] tracking-[1.5px]"
        >
            <div className="text-[14px] absolute -top-[30px] left-1 text-[gray]">
                {create_time ? getTimeAgo(create_time.toString()) : ""}
            </div>
            {/* 朗读播放按钮 */}
            <div
                className="play-button-bg dark:bg-bgDark dark:shadow-none rounded-[50%] w-12 h-12 absolute top-2 right-2 cursor-pointer"
                onClick={handlePlayBtn}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="20"
                    width="24"
                    className="volume_button absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"
                >
                    <path
                        clipRule="evenodd"
                        d="M11.26 3.691A1.2 1.2 0 0 1 12 4.8v14.4a1.199 1.199 0 0 1-2.048.848L5.503 15.6H2.4a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 1.2 0 0 1 1.2-1.2h3.103l4.449-4.448a1.2 1.2 0 0 1 1.308-.26Zm6.328-.176a1.2 1.2 0 0 1 1.697 0A11.967 11.967 0 0 1 22.8 12a11.966 11.966 0 0 1-3.515 8.485 1.2 1.2 0 0 1-1.697-1.697A9.563 9.563 0 0 0 20.4 12a9.565 9.565 0 0 0-2.812-6.788 1.2 1.2 0 0 1 0-1.697Zm-3.394 3.393a1.2 1.2 0 0 1 1.698 0A7.178 7.178 0 0 1 18 12a7.18 7.18 0 0 1-2.108 5.092 1.2 1.2 0 1 1-1.698-1.698A4.782 4.782 0 0 0 15.6 12a4.78 4.78 0 0 0-1.406-3.394 1.2 1.2 0 0 1 0-1.698Z"
                        fillRule="evenodd"
                    ></path>
                </svg>
            </div>
            <div className="mb-[28px] relative w-calc100-42">
                {isFocused ? (
                    <section
                        className={`rounded-lg absolute ${isFocused ? "glass" : ""
                            }  w-[101%] h-[105%] -left-[4px] -top-[2px]`}
                    ></section>
                ) : null}
                原文：{original_text}
            </div>
            中文翻译：
            <div
                suppressContentEditableWarning
                contentEditable
                ref={translationTextRef}
                onBlur={handleBlur}
                onFocus={handleFocus}
                className="whitespace-pre-wrap pr-[42px] outline-none leading-[3]"
            >
                {translation}
            </div>
            读音标记：
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
                {/* 录音按钮 */}
                <div className="toggle w-[40px] h-[40px] mr-[30px]">
                    <i className="ri-mic-fill z-[10] absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"></i>
                    <input
                        checked={recorderPressed}
                        onChange={handleRecordBtnClick}
                        type="checkbox"
                        className="double-click absolute z-[11]"
                    />
                    <span className="button dark:shadow-none dark:bg-bgDark w-[50px] h-[50px] -translate-x-1/2 -translate-y-1/2"></span>
                </div>
                {/* 录音播放按钮 */}
                <div className="toggle w-[40px] h-[40px]">
                    {/* 录音按钮更新中的loading */}
                    {recorderLoading ? (
                        <div className="spinner w-[40px] h-[40px]">
                            <div className="spinnerin"></div>
                        </div>
                    ) : (
                        <>
                            <i className="text-[22px] ri-play-circle-fill z-[10] absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"></i>
                            <input
                                checked={recordPlayBtnPressed}
                                onChange={handleRecordPlayBtnClick}
                                type="checkbox"
                                className="absolute z-[11]"
                            />
                            <span className="button dark:shadow-none dark:bg-bgDark w-[50px] h-[50px] -translate-x-1/2 -translate-y-1/2"></span>
                        </>
                    )}
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
        </div>
    );
}
