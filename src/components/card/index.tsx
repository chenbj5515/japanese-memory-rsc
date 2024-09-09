"use client"
import React from "react";
import { useRecorder } from "./hooks";
import { useCookies } from "react-cookie";
import { getTimeAgo, speakText, callChatApi } from "@/utils";
import { Dictation } from "@/components";
import { trpc } from '@/trpc/client'

interface IProps {
    originalText: string;
}

export function CardInHome(props: IProps) {
    const [recorderPressed, setRecorderPressedState] = React.useState(false);
    const [recordPlayBtnPressed, setRecordPlayBtnPressed] = React.useState(false);
    const cardIDRef = React.useRef("");
    const { originalText } = props;
    const [recorderLoading, setRecordedLoading] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const tanslationRef = React.useRef("");
    const kanaRef = React.useRef("");

    const [cookies] = useCookies(["user_id"]);
    const audioRef = React.useRef<any>();
    const cardRef = React.useRef(null);

    function handleBlurChange(type: string) {
        setIsFocused(type === "blur" ? false : true);
    }

    React.useEffect(() => {
        let translateDone = false,
            kanaDone = false;
        function handleAllDone() {
        }
        callChatApi(originalText, {
            onmessage(event: any) {
                if (event.data === "[DONE]") {
                    return;
                }
                const parsedData = JSON.parse(event.data);
                const curText = parsedData.choices
                    .map((choice: any) => {
                        if (choice.delta) {
                            return choice.delta.content;
                        }
                        return "";
                    })
                    .join("");
                tanslationRef.current += curText;
            },
            async onclose() {
                translateDone = true;
                if (translateDone && kanaDone) {
                    handleAllDone();
                }
            },
            onerror() { },
            prompt: "对我给出的日文，给出中文翻译",
        });
        callChatApi(originalText, {
            onmessage(event: any) {
                if (event.data === "[DONE]") {
                    return;
                }
                const parsedData = JSON.parse(event.data);
                const curText = parsedData.choices
                    .map((choice: any) => {
                        if (choice.delta) {
                            return choice.delta.content;
                        }
                        return "";
                    })
                    .join("");
                kanaRef.current += curText;
            },
            async onclose() {
                kanaDone = true;
                if (translateDone && kanaDone) {
                    handleAllDone();
                }
            },
            onerror() { },
            prompt: "对我给出的日文，给出假名形式的读音标记",
        });
    }, []);

    const { mediaRecorderRef } = useRecorder({
        async onEnd(recordedChunks) {
            setRecordedLoading(true);
            const cardID = cardIDRef.current;
            const audioBlob = new Blob(recordedChunks, { type: "audio/acc" });
            const formData = new FormData();
            const timeStamp = new Date().getTime();
            const recordFileName = `${cardID}${timeStamp}.mp3`;
            formData.append("audio", audioBlob, recordFileName);
            await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const audio = document.createElement("audio");
            audio.src = `http://localhost:8080/uploads/${recordFileName}`;
            // audio.src = `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_GOOGLE_CLOUD_BUKET}/${timeStamp}.acc`;
            audioRef.current = audio;
            setRecordedLoading(false);
        },
    });

    function handlePlayBtn() {
        console.log(cardIDRef.current);
        speakText(originalText, {
            voicerName: "ja-JP-NanamiNeural",
        });
    }

    function handleRecordBtnClick() {
        setRecorderPressedState((prev) => !prev);
        if (recorderPressed) {
            console.log("结束录制，stop方法被调用");
            mediaRecorderRef.current?.stop();
        } else {
            console.log("开始录制，start方法被调用");
            mediaRecorderRef.current?.start();
        }
    }

    function handleRecordPlayBtnClick() {
        setRecordPlayBtnPressed((prev) => !prev);
        audioRef.current?.play();
    }

    return (
        <div
            ref={cardRef}
            className="card rounded-[20px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-5 width-92-675 mx-auto mt-10 relative"
        >
            <div className="text-[14px] absolute -top-[30px] left-1 text-[gray]">
                刚刚
            </div>
            {/* AI朗读播放按钮 */}
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
            {/* <div className="mb-[28px] relative w-calc100-42">
        <section
          className={`rounded-lg absolute ${
            isFocused ? "glass" : ""
          }  w-[101%] h-[105%] -left-[4px] -top-[2px]`}
        ></section>
        原文：{originalText}
      </div> */}
            <div className="mb-[28px] relative w-calc100-42">
                {isFocused ? (
                    <section
                        className={`rounded-lg absolute ${isFocused ? "glass" : ""
                            }  w-[101%] h-[105%] -left-[4px] -top-[2px]`}
                    ></section>
                ) : null}
                原文：{originalText}
            </div>
            中文翻译：<div className="whitespace-pre-wrap pr-[42px]">{tanslationRef.current}</div>
            假名标记：<div className="whitespace-pre-wrap pr-[42px]">{kanaRef.current}</div>
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
                <Dictation
                    originalText={originalText}
                    onBlurChange={handleBlurChange}

                    cardID={cardIDRef.current}
                />
            </div>
        </div>
    );
}

interface IHistoryCardProps {
    translation: string;
    kanaPronunciation: string | null;
    originalText: string | null;
    recorderPath: string | null;
    createTime: string | null;
    cardID: string;
    forwardRef?: any;
}

export function CardInHistory(props: IHistoryCardProps) {
    const [recorderPressed, setRecorderPressedState] = React.useState(false);
    const [recordPlayBtnPressed, setRecordPlayBtnPressed] = React.useState(false);
    const { translation, kanaPronunciation, originalText, recorderPath, createTime, cardID, forwardRef } = props;
    const audioRef = React.useRef<any>();
    const [recorderLoading, setRecordedLoading] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const translationTextRef = React.useRef<any>(null);
    const kanaTextRef = React.useRef<any>(null);
    const cardRef = React.useRef(forwardRef);
    const updateKanaPronunciation = trpc.updateKanaPronunciation.useMutation();
    const updateTraslation = trpc.updateTraslation.useMutation();
    //   useShareCardID(forwardRef ?? cardRef, cardID);

    function handleBlurChange(type: string) {
        setIsFocused(type === "blur" ? false : true);
    }

    const { mediaRecorderRef } = useRecorder({
        async onEnd(recordedChunks) {
            setRecordedLoading(true);
            const audioBlob = new Blob(recordedChunks, { type: "audio/acc" });
            const formData = new FormData();
            const timeStamp = new Date().getTime();
            const recordFileName = `${cardID}${timeStamp}.mp3`;
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
        audio.src = recorderPath || "";
        audioRef.current = audio;
    }, []);

    function handlePlayBtn() {
        originalText && speakText(originalText, {
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

    async function handleBlur() {
        const updatedRecord = await updateTraslation.mutateAsync({
            id: cardID,
            translation: translationTextRef.current.textContent
        });
    }

    async function handleKanaBlur() {
        const updatedRecord = await updateKanaPronunciation.mutateAsync({
            id: cardID,
            kana_pronunciation: kanaTextRef.current.textContent
        });
    }

    return (
        <div
            ref={forwardRef ?? cardRef}
            className="card rounded-[20px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-5 width-92-675 mx-auto mt-10 relative leading-[1.9] tracking-[1.5px]"
        >
            <div className="text-[14px] absolute -top-[30px] left-1 text-[gray]">
                {createTime ? getTimeAgo(createTime) : ""}
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
                原文：{originalText}
            </div>
            中文翻译：
                <div
                    suppressContentEditableWarning
                    contentEditable
                    ref={translationTextRef}
                    onBlur={handleBlur}
                    className="whitespace-pre-wrap pr-[42px] outline-none leading-[3]"
                >
                    {translation}
                </div>
            读音标记：
                <div
                    suppressContentEditableWarning
                    contentEditable
                    ref={kanaTextRef}
                    onBlur={handleKanaBlur}
                    className="whitespace-pre-wrap pr-[42px] outline-none leading-[3]"
                >
                    {kanaPronunciation}
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
                    originalText ? (
                        <Dictation
                            originalText={originalText}
                            cardID={cardID}
                            onBlurChange={handleBlurChange}
                        />
                    ) : null
                }
            </div>
        </div>
    );
}
