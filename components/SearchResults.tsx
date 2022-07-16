import React, { FC } from "react";
import { Stack } from "@mui/material";
import ResultItem from "./ResultItem";

const SearchResults: FC<{
  results: Array<{
    url: string;
    name: string;
    artist: string;
    image: Array<{ size: string; "#text": string }>;
  }>;
}> = ({ results }) => {
  return (
    <Stack
      flexWrap={"wrap"}
      justifyContent={"center"}
      flexDirection={"row"}
      overflow={"auto"}
    >
      {results &&
        results.map((el) => {
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
