import React from "react";
// import { gql, useMutation } from "@apollo/client";
import diff_match_patch from "diff-match-patch";
import { trpc } from '@/trpc/client'

interface IProps {
  originalText: string;
  onBlurChange?: (state: string) => void;
  // isFocused: boolean;
  // setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  cardID: string;
}

// const UPDATE_REVIEW_TIMES = gql`
//   mutation UpdateMemoCard(
//     $cardID: uuid!
//   ) {
//     update_memo_card(
//       _inc: { review_times: 1 }
//       where: { id: { _eq: $cardID } }
//     ) {
//       returning {
//         review_times
//       }
//     }
//   }
// `;

export function Dictation(props: IProps) {
  const { originalText, cardID, onBlurChange } = props;
  const dictationRef = React.useRef<HTMLDivElement>(null);
  const [diffResult, setDiffResult] = React.useState<any>([]);
  // 入力内容
  const inputContentRef = React.useRef("");
  const dictationCheckInputRef = React.useRef<HTMLInputElement>(null);
  //   const [updateCardRecordPath] = useMutation(UPDATE_REVIEW_TIMES);
  const [showUserInput, setShowUserInput] = React.useState(true);
  const incrementReviewTimes = trpc.incrementReviewTimes.useMutation();

  function handleDictationChange() {
    inputContentRef.current = dictationRef.current?.textContent || "";
  }

  async function handleInputBlur() {
    // @ts-ignore
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(
      originalText,
      dictationRef.current?.textContent || ""
    );
    console.log(diff, "diff=======")
    setDiffResult(diff);
    // 默写正确
    if (diff.length === 1 && diff[0][0] === 0) {
      // 但是目前没有被打对号，需要标记为正确
      if (!dictationCheckInputRef.current?.checked) {
        dictationCheckInputRef.current?.click();
        const updatedRecord = await incrementReviewTimes.mutateAsync(cardID);
      }
    }
    // 默写错误
    else {
      // 但是现在已经被打了对号，需要把标记清空
      if (dictationCheckInputRef.current?.checked) {
        dictationCheckInputRef.current?.click();
      }
    }
    if (dictationRef.current) {
      dictationRef.current.textContent = "";
    }
    onBlurChange?.("blur")
    setShowUserInput(false);
  }

  function handleDiffResultClick() {
    setShowUserInput(true);
    setTimeout(() => {
      if (dictationRef.current) {
        dictationRef.current.focus();
      }
    })
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
      <div className="relative h-[52px]">
        <div
          ref={dictationRef}
          className="absolute dictation-input dark:bg-bgDark dark:shadow-none w-full mt-4 text-[15px]"
          style={{ visibility: showUserInput ? "visible" : "hidden" }}
          contentEditable
          onInput={handleDictationChange}
          onFocus={handleFocus}
          onBlur={handleInputBlur}
        />
        <div
          className="absolute dictation-input dark:bg-bgDark dark:shadow-none w-full mt-[16px] text-[15px]"
          style={{ visibility: showUserInput ? "hidden" : "visible" }}
          onClick={handleDiffResultClick}
        >
          <div className="w-full left-0 text-[15px] placeholder pointer-events-none">
            {diffResult.map(([result, text]: [number, string], i: number) => (
              <span
                key={i}
                className={`${result === -1
                  ? "text-wrong w-full break-words"
                  : result === 1
                    ? "text-correct w-full break-words"
                    : ""
                  }`}
              >
                {text}
              </span>
            ))}
          </div>
        </div >

        {/* {isFocused ? null : diffResult.length ? (
          
        ) : null} */}
      </div >
      <div>

      </div>
    </>
  );
}
