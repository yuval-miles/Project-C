import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { options } from "../store/slices/optionsSlice";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/collection.module.css";
import { Stack } from "@mui/material";
import { height } from "@mui/system";

interface collectionItem {
  position: number;
  id: string;
  name: string;
  img: string;
  size: string;
}

const createGrid = (options: options): Array<collectionItem[]> => {
  const newGrid: Array<collectionItem[]> = [];
  let position: number = 0;
  let size: string = "";
  switch (options.collectionType) {
    case "top40":
      for (let i = 0; i < 6; i++) {
        const newRow: collectionItem[] = [];
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
            name: "",
            img: "",
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

const Collection: FC = () => {
  const options = useSelector((state: RootState) => state.options);
  const [collection, setCollection] = useState<Array<collectionItem[]>>(
    createGrid(options)
  );
  return (
    <section className={styles.collection}>
      {collection.map((el) => (
        <Stack key={uuidv4()} direction={"row"} justifyContent={"center"}>
          {el.map((el) => (
            <div
              key={el.id}
              id={`${el.position}`}
              style={{
                backgroundColor: "white",
                width: el.size,
                height: el.size,
                margin: options.padding,
              }}
            ></div>
          ))}
        </Stack>
      ))}
    </section>
  );
};

export default Collection;
