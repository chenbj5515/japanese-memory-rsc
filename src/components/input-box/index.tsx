"use client"
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCard } from "@/store/local-cards-slice";
import { insertPlainTextAtCursor, parseJSONSafely, transformString } from "@/utils";
import { useForceUpdate } from "@/hooks";
import { checkLimit } from "@/server-actions/check-limit";
import { LockIcon, HelpCircle } from "lucide-react";
import * as ReactDOM from 'react-dom/client';
import { useTranslations } from "next-intl";

export function InputBox() {
  const editableRef = useRef<HTMLDivElement>(null);
  const forUpdate = useForceUpdate();
  const dispatch = useDispatch();
  const t = useTranslations('memoCards')
  const [isComposing, setIsComposing] = React.useState(false);
  const [isLimited, setIsLimited] = React.useState(false);
  const defaultText = t('inputPlaceholder');
  const limitText = (
    <>
      <LockIcon className="inline-block w-4 h-4 mr-1 align-text-bottom" />
      {t('limitMessage')}
      <span 
        className="text-blue-600 underline cursor-pointer" 
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = "/pricing";
        }}
      >
        Bunn Premium
      </span>
      解锁。
    </>
  );
  const ready2Send = editableRef.current?.textContent && editableRef.current?.textContent !== defaultText && !isLimited;
  const urlRef = useRef<string>("");

  async function handleSendBtnClick(originalText: string) {
    if (!originalText || originalText === defaultText || isLimited) return;
    try {
      dispatch(
        addCard({
          originalText: originalText.includes(":") ? originalText.split(":")[1].trim() : originalText.trim(),
          url: urlRef.current
        })
      );
      
      // 检查使用限制
      const hasReachedLimit = await checkLimit("memo_card");
      if (hasReachedLimit) {
        setIsLimited(true);
        if (editableRef.current) {
          editableRef.current.innerHTML = '';
          // 使用 ReactDOM 渲染复杂的 JSX
          const root = ReactDOM.createRoot(editableRef.current);
          root.render(limitText);
        }
      } else if (editableRef.current) {
        editableRef.current.textContent = "";
      }
      forUpdate();
    }
    catch (e) {
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const plainText = event.clipboardData.getData("text/plain");
    const parsedData = parseJSONSafely(plainText);

    if (typeof parsedData === 'object' && parsedData !== null) {
      urlRef.current = parsedData?.url || "";
      if ('text' in parsedData) {
        insertPlainTextAtCursor(transformString(parsedData.text));
      }
    } else {
      urlRef.current = "";
      insertPlainTextAtCursor(transformString(plainText));
    }
    forUpdate();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const content = editableRef.current?.textContent;
    if (!content) return;

    if (event.key === 'Enter') {
      if (isComposing || content === defaultText) {
        // 正在输入法合成，不触发发送
        return;
      }

      event.preventDefault();
      dispatch(addCard({
        originalText: content,
        url: urlRef.current
      }))
      if (editableRef.current) {
        editableRef.current.textContent = '';
      }
      forUpdate();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setTimeout(() => {
      setIsComposing(false);
    });
  };

  function handleBlur() {
    if (isLimited) return;
    if (editableRef.current && !editableRef.current.textContent?.trim()) {
      editableRef.current.textContent = defaultText;
      editableRef.current.classList.add("text-[#999]");
      forUpdate();
    }
  }

  function handleFocus() {
    if (isLimited) return;
    if (
      editableRef.current &&
      editableRef.current.textContent === defaultText
    ) {
      editableRef.current.textContent = "";
      editableRef.current.classList.remove("text-[#999]");
      forUpdate();
    }
  }

  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.classList.add("text-[#999]");
      editableRef.current.textContent = defaultText;
      // 初始检查限制
      checkLimit("memo_card").then(hasReachedLimit => {
        if (hasReachedLimit) {
          setIsLimited(true);
          if (editableRef.current) {
            editableRef.current.innerHTML = '';
            // 使用 ReactDOM 渲染复杂的 JSX
            const root = ReactDOM.createRoot(editableRef.current);
            root.render(limitText);
          }
        }
      });
      forUpdate();
    }
  }, []);

  return (
    <div className="relative w-full h-[52px]">
      <div 
        className="text-foreground absolute -top-[28px] left-0 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-gray-600 dark:text-gray-400 cursor-pointer"
        onClick={() => window.location.href = "/guide?scroll=1148"}
      >
        <HelpCircle className="w-4 h-4 mr-[2px]" />
        <span className="text-sm">{t('whereToGetSentence')}</span>
      </div>
      <div
        ref={editableRef}
        onPaste={handlePaste}
        onKeyUp={forUpdate}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className={`input-box dark:bg-bgDark dark:text-white dark:border-[1px] w-full p-3 pl-3 pr-12 rounded-lg border-2 border-lightgrey outline-none focus:border-[#808080] bg-[#fff] transhtmlForm`}
        contentEditable={!isLimited}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {!isLimited && (
        <div
          className={`w-[32px] h-[32px] ${ready2Send ? "bg-[#000] hover:bg-dark" : ""
            } rounded-[0.375rem] absolute top-[50%] -translate-y-1/2 right-4`}
          onClick={() => handleSendBtnClick(editableRef.current?.textContent || "")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4 absolute left-[50%] top-[50%] -translate-x-[42%] -translate-y-1/2 cursor-pointer"
            strokeWidth="2"
          >
            <path
              d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
              fill={ready2Send ? "white" : "grey"}
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}
