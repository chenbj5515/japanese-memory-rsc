"use client"
import React from "react";
import { speakText } from "@/utils";
import { MemoCard } from "@/components";
import { updateReviewTimes } from "./server-actions";

export function WordCards(props: any) {
    const [wordList, setWordList] = React.useState<any[]>(props.wordCards);

    const [cardInfo, setCardInfo] = React.useState<any>({});

    const [showGlass, setShowGlass] = React.useState(false);

    async function handleRecognizeClick(id: string) {
        await updateReviewTimes(id);
        setWordList(prev => prev.filter(item => item.id !== id));
    }

    // React.useEffect(() => {
    //     document.addEventListener("mouseup", (event) => {
    //         const inContainer =
    //             event.target === containerRef.current ||
    //             containerRef.current?.contains(event.target as any);
    //         if (inContainer === false) {
    //             setShowGlass(false);
    //         }
    //     });
    // }, []);

    function handleUnRecognizeClick(item: any) {
        setShowGlass(true);
        setCardInfo(item.memo_card);
    }

    function handlePlayBtn(text: string) {
        speakText(text, {
            voicerName: "ja-JP-NanamiNeural",
        });
    }

    return (
        <>
            {showGlass && cardInfo.id ? (
                <div className="fixed w-full h-full glass overflow-scroll z-[10000]">
                    <div className="absolute left-[50%] top-[50%] center">
                        <MemoCard {...cardInfo} />
                    </div>
                </div>
            ) : null}
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(210px,_1fr))] gap-4">
                {wordList.map((item, index) => (
                    <div
                        key={index}
                        className="word-card w-[240px] h-[150px] rounded-[8px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-5 mx-auto mt-10 relative"
                    >
                        <div
                            className="play-button-bg dark:bg-bgDark dark:shadow-none rounded-[50%] w-8 h-8 absolute top-2 right-2 cursor-pointer"
                            onClick={() => handlePlayBtn(item.word)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                height="16"
                                width="20"
                                className="volume_button absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2"
                            >
                                <path
                                    clipRule="evenodd"
                                    d="M11.26 3.691A1.2 1.2 0 0 1 12 4.8v14.4a1.199 1.199 0 0 1-2.048.848L5.503 15.6H2.4a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 1.2 0 0 1 1.2-1.2h3.103l4.449-4.448a1.2 1.2 0 0 1 1.308-.26Zm6.328-.176a1.2 1.2 0 0 1 1.697 0A11.967 11.967 0 0 1 22.8 12a11.966 11.966 0 0 1-3.515 8.485 1.2 1.2 0 0 1-1.697-1.697A9.563 9.563 0 0 0 20.4 12a9.565 9.565 0 0 0-2.812-6.788 1.2 1.2 0 0 1 0-1.697Zm-3.394 3.393a1.2 1.2 0 0 1 1.698 0A7.178 7.178 0 0 1 18 12a7.18 7.18 0 0 1-2.108 5.092 1.2 1.2 0 1 1-1.698-1.698A4.782 4.782 0 0 0 15.6 12a4.78 4.78 0 0 0-1.406-3.394 1.2 1.2 0 0 1 0-1.698Z"
                                    fillRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                        <div>{item.word}</div>
                        <div className="mt-1 relative">
                            <section
                                className={`rounded-lg absolute unique-glass ${"glass"}  w-[101%] h-[105%] -left-[4px] -top-[2px]`}
                            ></section>
                            {item.meaning}
                        </div>
                        <div className="flex justify-between w-[175px] absolute bottom-4">
                            <button
                                onClick={() =>
                                    handleRecognizeClick(item.id)
                                }
                                className="btn2 shadow-little-button dark:shadow-[#353232] dark:bg-bgDark"
                            >
                                认识
                            </button>
                            <button
                                onClick={() => handleUnRecognizeClick(item)}
                                className="btn2 shadow-little-button dark:shadow-[#353232] dark:bg-bgDark"
                            >
                                不认识
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}