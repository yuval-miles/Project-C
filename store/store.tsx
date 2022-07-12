import { configureStore } from "@reduxjs/toolkit";
import options from "./slices/optionsSlice";
import searchBar from "./slices/searchBarSlice";

export const store = configureStore({
  reducer: {
    options,
    searchBar,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
