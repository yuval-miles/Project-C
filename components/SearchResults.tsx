import React, { FC } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Results } from "../store/slices/searchBarSlice";
import Image from "next/image";
import { RootState } from "../store/store";

const SearchResults: FC = () => {
  const results: Results | null = useSelector(
    (state: RootState) => state.searchBar.results,
    shallowEqual
  );
  return (
    <div>
      {results &&
        results.album.map((el) => {
          if (!el.image[1]["#text"]) return;
          return (
            <Image
              key={el.url}
              src={el.image[1]["#text"]}
              alt="test"
              width={50}
              height={50}
            />
          );
        })}
    </div>
  );
};

export default React.memo(SearchResults);
