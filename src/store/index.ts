import { configureStore } from "@reduxjs/toolkit";
import localCardsSlice from './local-cards-slice';


export default configureStore({
  reducer: {
    localCardsSlice,
  },
});
