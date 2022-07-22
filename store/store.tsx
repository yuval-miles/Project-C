import { configureStore } from "@reduxjs/toolkit";
import options from "./slices/optionsSlice";
import collection from "./slices/collectionSlice";
import userCollections from "./slices/userCollectionsSlice";

export const store = configureStore({
  reducer: {
    options,
    collection,
    userCollections,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
