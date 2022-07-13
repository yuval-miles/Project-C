import { configureStore } from "@reduxjs/toolkit";
import options from "./slices/optionsSlice";
import searchBar from "./slices/searchBarSlice";
import collection from "./slices/collectionSlice";

export const store = configureStore({
  reducer: {
    options,
    searchBar,
    collection,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
