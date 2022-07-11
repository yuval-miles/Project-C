import { configureStore } from "@reduxjs/toolkit";
import options from "./slices/optionsSlice";

export const store = configureStore({
  reducer: {
    options,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
