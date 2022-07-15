import React, { FC } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { ResultItemType } from "./ResultItem";
import { useDrop, useDrag } from "react-dnd";
import {
  updateCollectionItem,
  updateAddedItems,
  removeAddedItem,
} from "../store/slices/collectionSlice";
import { CollectionItemType } from "../functions/createNewGrid";
import Image from "next/image";
import { addedItemsObj } from "../hooks/useSetGrid";

const CollectionItem: FC<{
  id: [number, number];
  position: number;
}> = ({ id: [rowIndex, columnIdex], position }) => {
  const dispatch = useDispatch();
  const {
    padding,
    collectionItem: { size, url, albumName, artist, id },
  } = useSelector<
    RootState,
    { padding: number; collectionItem: CollectionItemType }
  >(
    (state: RootState): any => ({
      padding: state.options.padding,
      collectionItem: state.collection.data[rowIndex][columnIdex],
    }),
    shallowEqual
  );
  const [, drop] = useDrop(
    () => ({
      accept: "image",
      drop(item: ResultItemType) {
        addedItemsObj[position as number] = {
          url: item.url,
          albumName: item.albumName,
          artist: item.artist,
          id,
        };
        dispatch(
          updateAddedItems({
            [position]: {
              url: item.url,
              albumName: item.albumName,
              artist: item.artist,
              id,
            },
          })
        );
        if (item?.positionId) {
          if (url) {
            addedItemsObj[item.position as number] = {
              url,
              albumName,
              artist,
              id,
            };
          }
          dispatch(
            updateAddedItems({
              [item.position as number]: {
                url,
                albumName,
                artist,
                id,
              },
            })
          );
          dispatch(
            updateCollectionItem({
              position: [item.positionId[0], item.positionId[1]],
              newData: { url, albumName, artist },
            })
          );
        }
        dispatch(
          updateCollectionItem({
            position: [rowIndex, columnIdex],
            newData: item,
          })
        );

        return undefined;
      },
    }),
    [url, albumName, artist]
  );
  const [_, drag] = useDrag(
    () => ({
      type: "image",
      item: {
        url,
        artist,
        albumName,
        positionId: [rowIndex, columnIdex],
        position,
      },
      collect: (monitor) => {
        if (monitor.isDragging() && url) {
          delete addedItemsObj[position as number];
          dispatch(removeAddedItem(position));
          dispatch(
            updateCollectionItem({
              position: [rowIndex, columnIdex],
              newData: {
                url: "",
                artist: "",
                albumName: "",
              },
            })
          );
        }
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
