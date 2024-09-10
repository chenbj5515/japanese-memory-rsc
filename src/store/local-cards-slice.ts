import { createSlice } from "@reduxjs/toolkit";
import { Prisma } from '@prisma/client';

export const localCardsSlice = createSlice({
  name: "localCards",
  initialState: {
    localCards: [] as Prisma.memo_cardGetPayload<{}>[],
  },
  reducers: {
    addCard: (state, action) => {
      state.localCards.push({
        ...action.payload
      })
    },
  },
});

export const { addCard } = localCardsSlice.actions;

export default localCardsSlice.reducer;
