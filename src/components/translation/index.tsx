"use client"
import React from "react";
import { Dictation } from "@/components";
import { updateMemoCardTranslation } from "./server-actions";
import { Prisma } from "@prisma/client";

export function Translation(props: Pick<Prisma.memo_cardGetPayload<{}>, 'id' | 'original_text' | 'translation'>) {
  const { id, original_text, translation } = props;
  const translationTextRef = React.useRef<HTMLDivElement>(null);

  function handleBlur() {
    if (translationTextRef.current?.textContent) {
      updateMemoCardTranslation(id, translationTextRef.current?.textContent)
    }
  }

  return (
    <>
      <div className="card rounded-[20px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-5 w-[675px] width-92-675 mx-auto mt-10 relative">
        <div
          suppressContentEditableWarning
          ref={translationTextRef}
          contentEditable
          onBlur={handleBlur}
          className="whitespace-pre-wrap pr-[42px] outline-none leading-[3]"
        >
          {translation}
        </div>
        {
          original_text ? <Dictation originalText={original_text} cardID={id} /> : null
        }
      </div>
    </>
  );
}
