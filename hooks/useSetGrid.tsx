import { useDispatch } from "react-redux";
import { createGrid } from "../store/slices/collectionSlice";
import { createNewGrid } from "../functions/createNewGrid";
import { AddedItemsType } from "../functions/createNewGrid";

export const useSetGrid = () => {
  const dispatch = useDispatch();
  return function (type: string, rows: number, columns: number) {
    dispatch(createGrid(createNewGrid(type, addedItemsObj, rows, columns)));
  };
};

export const addedItemsObj: AddedItemsType = {};
