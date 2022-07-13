import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ResultItemType } from "../../components/ResultItem";
import { v4 as uuidv4 } from "uuid";

export interface CollectionItemType {
  position: number;
  id: string;
  albumName: string;
  artist: string;
  url: string;
  size: string;
}

export const createNewGrid = (
  collectionType: string
): Array<CollectionItemType[]> => {
  const newGrid: Array<CollectionItemType[]> = [];
  let position: number = 0;
  let size: string = "";
  switch (collectionType) {
    case "top40":
      for (let i = 0; i < 6; i++) {
        const newRow: CollectionItemType[] = [];
        let rowItems: number = 0;
        switch (true) {
          case i === 0:
            rowItems = 5;
            size = "200px";
            break;
          case i < 3 && i > 0:
            rowItems = 6;
            size = "160px";
            break;
          case i > 2 && i < 5:
            rowItems = 7;
            size = "130px";
            break;
          case i === 5:
            rowItems = 9;
            size = "90px";
            break;
        }
        for (let j = 0; j < rowItems; j++) {
          newRow.push({
            id: uuidv4(),
            albumName: "",
            artist: "",
            url: "",
            position,
            size: size,
          });
          position++;
        }
        newGrid.push(newRow);
      }
      return newGrid;
    case "top42":
      return newGrid;
    case "collage":
      return newGrid;
    case "top100":
      return newGrid;
    default:
      return newGrid;
  }
};

const initState: Array<CollectionItemType[]> = createNewGrid("top40");

export const collectionSlice = createSlice({
  name: "collection",
  initialState: initState,
  reducers: {
    createGrid: (
      state,
      { payload }: PayloadAction<Array<CollectionItemType[]>>
    ) => ({ ...payload }),
    updateCollectionItem: (
      state,
      {
        payload: { position, newData },
      }: PayloadAction<{
        position: Array<number>;
        newData: ResultItemType;
      }>
    ) => {
      state[position[0]][position[1]] = {
        ...state[position[0]][position[1]],
        ...newData,
      };
    },
  },
});

export const { updateCollectionItem, createGrid } = collectionSlice.actions;

export default collectionSlice.reducer;
