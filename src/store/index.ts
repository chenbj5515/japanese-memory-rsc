import { configureStore } from "@reduxjs/toolkit";
import { Prisma } from '@prisma/client';
import localCardsSlice from './local-cards-slice';

export default configureStore({
  reducer: {
    localCardsSlice,
  },
});

export interface RootState {
  localCardsSlice: {
    localCards: Prisma.memo_cardGetPayload<{}>[];
  };
}
