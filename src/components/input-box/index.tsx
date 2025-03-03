"use client"
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import { readStreamableValue } from 'ai/rsc';
import { addCard } from "@/store/local-cards-slice";
import { insertPlainTextAtCursor, parseJSONSafely, transformString } from "@/utils";
import { useForceUpdate } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { askAI } from "@/server-actions";

export function InputBox() {
  const editableRef = useRef<HTMLDivElement>(null);
  const forUpdate = useForceUpdate();
  const dispatch = useDispatch();
  const [isComposing, setIsComposing] = React.useState(false);
  const defaultText = "学びたい日本語の文を入力してください";
  const ready2Send = editableRef.current?.textContent && editableRef.current?.textContent !== defaultText;
  const urlRef = useRef<string>("");

  async function handleSendBtnClick(originalText: string) {
    if (!originalText || originalText === defaultText) return;
    try {
      dispatch(
        addCard({
          originalText: originalText.includes(":") ? originalText.split(":")[1].trim() : originalText.trim(),
          url: urlRef.current
        })
      );
      if (editableRef.current) {
        editableRef.current.textContent = "";
        forUpdate();
      }
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

  async function handleClick() {
    if (editableRef.current) {
      editableRef.current.textContent = "";
      editableRef.current.classList.remove("text-[#999]"); // 移除灰色样式
      const { output } = await askAI("春夏秋冬、愛憎情仇、ランダムにテーマを選んで俳句を生成します。句読点は完全である必要がありますが、引用符は使用しないでください。まだ、その俳句だけを出してください、説明など全部要らないです。", 0.9);
      for await (const delta of readStreamableValue(output)) {
        if (editableRef.current && delta) {
          editableRef.current.textContent += delta;
        }
      }
      forUpdate();
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setTimeout(() => {
      setIsComposing(false);
    });
  };

  function handleBlur() {
    if (editableRef.current && !editableRef.current.textContent?.trim()) {
      editableRef.current.textContent = defaultText;
      editableRef.current.classList.add("text-[#999]");
      forUpdate();
    }
  }

  function handleFocus() {
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
      editableRef.current.textContent = defaultText
      forUpdate();
    }
  }, []);

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={350}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="hidden sm:inline-flex w-10 h-10 p-0 absolute left-[-60px] top-[4px]"
              onClick={handleClick}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-primary text-primary-foreground">
            <p className="text-sm">ランダムに日本語の文が生成します</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div
        ref={editableRef}
        onPaste={handlePaste}
        onKeyUp={forUpdate}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className="input-box dark:bg-bgDark dark:text-white dark:border-[1px] absolute w-full p-3 pl-3 pr-12 rounded-lg border-2 border-lightgrey outline-none focus:border-[#808080] bg-[#fff] left-[50%] bottom-0 transhtmlForm -translate-x-1/2"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
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
    </>
  );
}
