import { configureStore } from "@reduxjs/toolkit";
import localCardsSlice, {ILoaclCard} from './local-cards-slice';

export default configureStore({
  reducer: {
    localCardsSlice,
  },
});

export interface RootState {
  localCardsSlice: {
    localCards: ILoaclCard[];
  };
}
