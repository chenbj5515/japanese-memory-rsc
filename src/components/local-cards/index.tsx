import React from "react";
import { useSelector } from "react-redux";
// import { LocalCard } from "../card";


export function CardList() {
  const { localCards } = useSelector((state: any) => state.localCardsSlice);

  return (
    <>
      {/* {localCards?.map(({ originalText, key }: any) => (
        <LocalCard key={key} originalText={originalText} />
      ))} */}
    </>
  );
}
