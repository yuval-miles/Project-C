import React, { FC, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { CollectionType, createNewGrid } from "../functions/createNewGrid";
import styles from "../styles/collection.module.css";
import { Stack } from "@mui/material";
import CollectionItem from "./CollectionItem";
import { RootState } from "../store/store";

const Collection: FC = () => {
  const { collectionType, rows, columns } = useSelector(
    (state: RootState) => ({
      collectionType: state.options.collectionType,
      rows: state.options.gridRows,
      columns: state.options.gridColumns,
    }),
    shallowEqual
  );
  const grid = useRef<CollectionType>(
    createNewGrid(collectionType, undefined, rows, columns)
  );
  grid.current = createNewGrid(collectionType, undefined, rows, columns);
  return (
    <section className={styles.collection}>
      {grid.current.map((el, rowIndex) => (
        <Stack
          key={el[0].id + el[0].size}
          direction={"row"}
          justifyContent={"center"}
        >
          {el.map((el, columnIndex) => (
            <CollectionItem
              key={el.id}
              id={[rowIndex, columnIndex]}
              position={el.position}
            />
          ))}
        </Stack>
      ))}
    </section>
  );
};

export default Collection;
