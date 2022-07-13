import React, { FC } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { ResultItemType } from "./ResultItem";
import { useDrop, useDrag } from "react-dnd";
import {
  updateCollectionItem,
  CollectionItemType,
} from "../store/slices/collectionSlice";
import Image from "next/image";

const CollectionItem: FC<{ id: [number, number] }> = ({
  id: [rowIndex, columnIdex],
}) => {
  const dispatch = useDispatch();
  const {
    padding,
    collectionItem: { size, url, albumName, artist },
  } = useSelector<
    RootState,
    { padding: number; collectionItem: CollectionItemType }
  >(
    (state: RootState): any => ({
      padding: state.options.padding,
      collectionItem: state.collection[rowIndex][columnIdex],
    }),
    shallowEqual
  );
  const [, drop] = useDrop(
    () => ({
      accept: "image",
      drop(item: ResultItemType) {
        dispatch(
          updateCollectionItem({
            position: [rowIndex, columnIdex],
            newData: item,
          })
        );
        return undefined;
      },
    }),
    []
  );
  const [_, drag] = useDrag(
    () => ({
      type: "image",
      item: { url, artist, albumName },
      collect: (monitor) => {
        if (monitor.isDragging() && url)
          dispatch(
            updateCollectionItem({
              position: [rowIndex, columnIdex],
              newData: { url: "", artist: "", albumName: "" },
            })
          );
        return {
          isDragging: monitor.isDragging(),
        };
      },
    }),
    [url, artist, albumName]
  );
  return (
    <div
      ref={drop}
      style={{
        backgroundColor: "white",
        width: size,
        height: size,
        margin: padding,
      }}
    >
      {url && (
        <div ref={drag}>
          <Image src={url} alt="collection-item" width={size} height={size} />
        </div>
      )}
    </div>
  );
};

export default React.memo(CollectionItem);
