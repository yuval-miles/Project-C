import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface options {
  collectionType: string;
  gridRows: number;
  gridColumns: number;
  itemPadding: number;
  checkboxArr: string[];
  padding: number;
  showOptions: boolean;
}

const initState: options = {
  collectionType: "top40",
  gridRows: 5,
  gridColumns: 7,
  itemPadding: 0,
  checkboxArr: [],
  padding: 5,
  showOptions: false,
};

export const optionsSlice = createSlice({
  name: "options",
  initialState: initState,
  reducers: {
    updateOptions: (state, { payload }: PayloadAction<object>) => ({
      ...state,
      ...payload,
    }),
  },
});

export const { updateOptions } = optionsSlice.actions;

export default optionsSlice.reducer;
