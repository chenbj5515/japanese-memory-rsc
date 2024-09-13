import React from "react";
import diff_match_patch from "diff-match-patch";
import { updateReviewTimes } from "./server-actions";

interface IProps {
  originalText: string;
  onBlurChange?: (state: string) => void;
  cardID: string;
}

export function Dictation(props: IProps) {
  const { originalText, cardID, onBlurChange } = props;
  const dictationRef = React.useRef<HTMLDivElement>(null);
  // 入力内容
  const inputContentRef = React.useRef("");
  const dictationCheckInputRef = React.useRef<HTMLInputElement>(null);

  function handleDictationChange() {
    inputContentRef.current = dictationRef.current?.textContent || "";
  }

  async function handleBlur() {
    // @ts-ignore
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(
      originalText,
      dictationRef.current?.textContent || ""
    );
    console.log(diff, "diff=============")
    const htmlString = diff.map(([result, text]) => {
      return `<span class="${
        result === -1
          ? "text-wrong w-full break-words pointer-events-none"
          : result === 0
          ? "text-correct w-full break-words pointer-events-none"
          : ""
      }">${text}</span>`;
    }).join("");
    if (dictationRef.current) {
      dictationRef.current.innerHTML = htmlString;
    }
    // 默写正确
    if (diff.length === 1 && diff[0][0] === 0) {
      // 但是目前没有被打对号，需要标记为正确
      if (!dictationCheckInputRef.current?.checked) {
        dictationCheckInputRef.current?.click();
        updateReviewTimes(cardID);
      }
    }
    // 默写错误
    else {
      // 但是现在已经被打了对号，需要把标记清空
      if (dictationCheckInputRef.current?.checked) {
        dictationCheckInputRef.current?.click();
      }
    }
    onBlurChange?.("blur")
  }

  function handleFocus() {
    if (dictationRef.current) {
      dictationRef.current.textContent = inputContentRef.current;
    }
    onBlurChange?.("focus")
  }

  return (
    <>
      <div className="dictation-check-container dark:shadow-dark-shadow w-[18px] h-[18px] mt-2 relative">
        <input
          ref={dictationCheckInputRef}
          type="checkbox"
          className="hidden"
        />
        <svg
          className="overflow-visible"
          viewBox="0 0 64 64"
          height="18px"
          width="18px"
        >
          <path
            d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
            pathLength="575.0541381835938"
            stroke="grey"
            className="path"
          ></path>
        </svg>
        <div className="absolute top-[50%] -translate-y-1/2 left-7 whitespace-nowrap text-gray text-[14px]">
          请在下面默写原文
        </div>
      </div>
      <div
          suppressContentEditableWarning
          ref={dictationRef}
          className="dictation-input dark:bg-bgDark dark:shadow-none w-full mt-4 text-[15px] min-h-[40px]"
          contentEditable
          onInput={handleDictationChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
    </>
  );
}
