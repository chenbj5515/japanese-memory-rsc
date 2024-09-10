import { createSlice } from "@reduxjs/toolkit";
import { Prisma } from '@prisma/client';

export interface ILoaclCard {
  key: number;
  originalText: string,
}

export const localCardsSlice = createSlice({
  name: "localCards",
  initialState: {
    localCards: [] as ILoaclCard[],
  },
  reducers: {
    addCard: (state, action) => {
      state.localCards.push({
        key: new Date().getTime(),
        originalText: action.payload.originalText
      })
    },
  },
});

export const { addCard } = localCardsSlice.actions;

export default localCardsSlice.reducer;
