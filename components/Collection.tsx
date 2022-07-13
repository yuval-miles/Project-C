import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createGrid,
  createNewGrid,
  CollectionItemType,
} from "../store/slices/collectionSlice";
import styles from "../styles/collection.module.css";
import { Stack } from "@mui/material";
import CollectionItem from "./CollectionItem";

const grid: Array<CollectionItemType[]> = createNewGrid("top40");

const Collection: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createGrid(grid));
  }, [dispatch]);
  return (
    <section className={styles.collection}>
      {grid.map((el, rowIndex) => (
        <Stack
          key={el[0].id + el[0].size}
          direction={"row"}
          justifyContent={"center"}
        >
          {el.map((el, columnIndex) => (
            <CollectionItem key={el.id} id={[rowIndex, columnIndex]} />
          ))}
        </Stack>
      ))}
    </section>
  );
};

export default Collection;
