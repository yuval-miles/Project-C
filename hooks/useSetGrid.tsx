import { useDispatch } from "react-redux";
import { createGrid } from "../store/slices/collectionSlice";
import { createNewGrid } from "../functions/createNewGrid";
import { AddedItemsType } from "../functions/createNewGrid";
import { useEffect } from "react";

export const useSetGrid = (): ((
  type: string,
  rows: number,
  columns: number
) => void) => {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      for (const el in addedItemsObj) delete addedItemsObj[el];
    };
  }, []);
  return function (type: string, rows: number, columns: number) {
    dispatch(createGrid(createNewGrid(type, addedItemsObj, rows, columns)));
  };
};

export const addedItemsObj: AddedItemsType = {};
