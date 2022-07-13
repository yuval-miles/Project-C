import React, { FC } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Results } from "../store/slices/searchBarSlice";
import { RootState } from "../store/store";
import { Stack } from "@mui/material";
import ResultItem from "./ResultItem";

const SearchResults: FC = () => {
  const results: Results | null = useSelector(
    (state: RootState) => state.searchBar.results,
    shallowEqual
  );
  return (
    <Stack
      flexWrap={"wrap"}
      justifyContent={"center"}
      flexDirection={"row"}
      overflow={"auto"}
    >
      {results &&
        results.album.map((el) => {
          if (!el.image[3]["#text"]) return;
          return (
            <ResultItem
              key={el.url}
              albumName={el.name}
              url={el.image[3]["#text"]}
              artist={el.artist}
            />
          );
        })}
    </Stack>
  );
};

export default React.memo(SearchResults);
