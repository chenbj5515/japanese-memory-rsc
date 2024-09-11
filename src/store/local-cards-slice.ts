import { createSlice } from "@reduxjs/toolkit";
export interface ILoaclCard {
  key: number;
  original_text: string
}

export const localCardsSlice = createSlice({
  name: "localCards",
  initialState: {
    localCards: [] as ILoaclCard[],
  },
  reducers: {
    addCard: (state, action) => {
      state.localCards.push({
        key: Math.random(),
        original_text: action.payload
      })
    },
  },
});

export const { addCard } = localCardsSlice.actions;

export default localCardsSlice.reducer;
