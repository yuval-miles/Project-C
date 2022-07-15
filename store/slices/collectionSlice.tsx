import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ResultItemType } from "../../components/ResultItem";
import { CollectionType } from "../../functions/createNewGrid";
import { AddedItemsType } from "../../functions/createNewGrid";

export type CollectionSliceType = {
  data: CollectionType;
  addedItems: AddedItemsType;
};

const initialState: CollectionSliceType = { data: [[]], addedItems: {} };

export const collectionSlice = createSlice({
  name: "collection",
  initialState: initialState,
  reducers: {
    createGrid: (state, { payload }: PayloadAction<CollectionType>) => ({
      ...state,
      data: payload,
    }),
    updateAddedItems: (state, { payload }: PayloadAction<AddedItemsType>) => {
      state.addedItems = {
        ...state.addedItems,
        ...payload,
      };
    },
    removeAddedItem: (state, { payload }: PayloadAction<number>) => {
      delete state.addedItems[payload as keyof AddedItemsType];
    },
    updateCollectionItem: (
      state,
      {
        payload: { position, newData },
      }: PayloadAction<{
        position: Array<number>;
        newData: ResultItemType;
      }>
    ) => {
      state.data[position[0]][position[1]] = {
        ...state.data[position[0]][position[1]],
        ...newData,
      };
    },
  },
});

export const {
  updateCollectionItem,
  createGrid,
  updateAddedItems,
  removeAddedItem,
} = collectionSlice.actions;

export default collectionSlice.reducer;
