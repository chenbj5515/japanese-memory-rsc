"use client"
import React, { useRef, useReducer } from "react";
import { useDispatch } from "react-redux";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useChat } from 'ai/react';
import { addCard } from "@/store/local-cards-slice";
import { insertPlainTextAtCursor, callChatApi } from "@/utils";
import { useForceUpdate } from "@/hooks";
import { allowSendStatereducer } from "./reducers";

export function InputBox() {
  const editableRef = useRef<any>();

  const [{ allowSendFlg }, dispath] = useReducer(allowSendStatereducer, {
    allowSendFlg: false,
  });

  const forUpdate = useForceUpdate();
  const dispatch = useDispatch();

  async function handleSendBtnClick(originalText: string) {
    try {
      
      // 使用正则表达式提取出所有符合「0:"信息"」的内容

      // const translation = await askAI(originalText, "对我给出的日文，给出中文翻译");
      // const pronunciation = await askAI(originalText, "对我给出的日文，给出假名形式的读音标记");
      // const record = await insertMemoCard(originalText, translation, pronunciation);
      dispatch(
        addCard(originalText)
      );
      if (editableRef.current) {
        editableRef.current.textContent = "";
        forUpdate();
      }
    }
    catch (e) {
      console.log(e, "e==========")
    }
  }

  const handlePaste = (event: any) => {
    event.preventDefault();
    const plainText = event.clipboardData.getData("text/plain");
    insertPlainTextAtCursor(plainText);
    forUpdate();
  };

  function handleInput() {
    dispath({ type: "input" });
  }

  const handleKeyDown = (event: any) => {
    const content = editableRef.current.textContent;

    if (event.key === "Enter" && content) {
      event.preventDefault();
      if (allowSendFlg) {
        // handleSendBtnClick(content);
      } else {
        dispath({ type: "enterKeyDown" });
      }
    }
  };

  return (
    <>
      sdsdsdsd
      <div
        ref={editableRef}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="dark:bg-bgDark dark:text-white dark:border-[1px] absolute input bg-[#fff] left-[50%] bottom-0 transhtmlForm -translate-x-1/2"
        contentEditable
      />
      <div
        className={`w-[32px] h-[32px] ${editableRef.current?.textContent ? "bg-[#d329d3] hover:bg-dark" : ""
          } rounded-[0.375rem] absolute top-[50%] -translate-y-1/2 right-4`}
        onClick={() => handleSendBtnClick(editableRef.current.textContent)}
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
            fill={editableRef.current?.textContent ? "white" : "grey"}
          ></path>
        </svg>
      </div>
      {/* <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}

        <form onSubmit={handleCustomSubmit}>
          <input
            className="dark:bg-bgDark dark:text-white dark:border-[1px] absolute input bg-[#fff] left-[50%] bottom-0 transhtmlForm -translate-x-1/2"
            value={input}
            placeholder="こちらで分からない日本語を入力してください"
            onChange={handleInputChange}
          />
        </form>
      </div> */}
    </>
  );
}
