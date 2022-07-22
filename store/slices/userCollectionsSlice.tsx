import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { JSONValue } from "superjson/dist/types";

interface UserCollectionsType {
  id: string;
  userId: string;
  name: string;
  addedItems: JSONValue;
  collectionSetting: JSONValue;
}

const initState: UserCollectionsType[] = [
  { id: "", name: "", userId: "", addedItems: {}, collectionSetting: {} },
];

export const userCollectionsSlice = createSlice({
  name: "userCollections",
  initialState: initState,
  reducers: {
    setUserCollections(
      state,
      { payload }: PayloadAction<UserCollectionsType[]>
    ) {
      return [...payload];
    },
    changeCollectionName(
      state,
      {
        payload: { collectionId, newName },
      }: PayloadAction<{ collectionId: string; newName: string }>
    ) {
      state.map((el) => {
        if (el.id === collectionId) el.name = newName;
      });
    },
    deleteCollection(state, { payload }: PayloadAction<string>) {
      const newState = state.filter((el) => el.id !== payload);
      return newState;
    },
  },
});

export const { setUserCollections, changeCollectionName, deleteCollection } =
  userCollectionsSlice.actions;

export default userCollectionsSlice.reducer;
