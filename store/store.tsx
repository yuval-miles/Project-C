import { configureStore } from "@reduxjs/toolkit";
import options from "./slices/optionsSlice";
import collection from "./slices/collectionSlice";

export const store = configureStore({
  reducer: {
    options,
    collection,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
