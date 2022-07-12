import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://localhost:3000/api/";

export enum searchType {
  Albums = "albums",
  Movies = "movies",
}

export interface SearchBarInput {
  input: string;
  searchType: searchType;
  status: string;
  error: undefined | string;
  results: Array<object>;
}

const initState: SearchBarInput = {
  input: "",
  searchType: searchType.Albums,
  status: "idle",
  error: undefined,
  results: [],
};

export const fetchResults = createAsyncThunk(
  "searchBar/fetchResults",
  async (input: string) => {
    try {
      const { data } = await axios.get(`${baseURL}getAlbums?search=${input}`);
      if (data.message === "failed") throw new Error(data.response);
      return data.response;
    } catch (error) {
      return error;
    }
  }
);

export const searchBarSlice = createSlice({
  name: "searchBar",
  initialState: initState,
  reducers: {
    updateSearchBar: (state, { payload }: PayloadAction<object>) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResults.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload;
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const { updateSearchBar } = searchBarSlice.actions;

export default searchBarSlice.reducer;
