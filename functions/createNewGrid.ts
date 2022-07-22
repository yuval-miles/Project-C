import { v4 as uuidv4 } from "uuid";

export interface CollectionItemType {
  position: number;
  id: string;
  albumName: string;
  artist: string;
  url: string;
  size: string;
}

export type CollectionType = Array<CollectionItemType[]>;

export type AddedItemsType = {
  [key: number]: {
    url: string;
    artist: string;
    albumName: string;
    id: string;
  };
};

export const createNewGrid = (
  collectionType: string,
  addedItems?: AddedItemsType,
  rows?: number,
  columns?: number
): CollectionType => {
  console.log(collectionType);
  const newGrid: CollectionType = [];
  let position: number = 0;
  let size: string = "";
  switch (collectionType) {
    case "top40":
      for (let i = 0; i < 6; i++) {
        const newRow: CollectionItemType[] = [];
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
          if (addedItems) {
            if (addedItems.hasOwnProperty(position)) {
              const newItem: CollectionItemType = Object.assign(
                {},
                {
                  ...addedItems[position as keyof AddedItemsType],
                  position,
                  size,
                }
              );
              newRow.push({ ...newItem });
            } else {
              newRow.push({
                id: uuidv4(),
                albumName: "",
                artist: "",
                url: "",
                position,
                size: size,
              });
            }
          } else {
            newRow.push({
              id: uuidv4(),
              albumName: "",
              artist: "",
              url: "",
              position,
              size: size,
            });
          }
          position++;
        }
        newGrid.push(newRow);
      }
      return newGrid;
    case "top42":
      for (let i = 0; i < 6; i++) {
        const newRow: CollectionItemType[] = [];
        let rowItems: number = 0;
        switch (true) {
          case i < 2:
            rowItems = 5;
            size = "200px";
            break;
          case i >= 2 && i < 4:
            rowItems = 6;
            size = "165px";
            break;
          case i >= 4:
            rowItems = 10;
            size = "95px";
            break;
        }
        for (let j = 0; j < rowItems; j++) {
          if (addedItems) {
            if (addedItems.hasOwnProperty(position)) {
              const newItem: CollectionItemType = Object.assign(
                {},
                {
                  ...addedItems[position as keyof AddedItemsType],
                  position,
                  size,
                }
              );
              newRow.push({ ...newItem });
            } else {
              newRow.push({
                id: uuidv4(),
                albumName: "",
                artist: "",
                url: "",
                position,
                size: size,
              });
            }
          } else {
            newRow.push({
              id: uuidv4(),
              albumName: "",
              artist: "",
              url: "",
              position,
              size: size,
            });
          }
          position++;
        }
        newGrid.push(newRow);
      }
      return newGrid;
    case "top100":
      for (let i = 0; i < 11; i++) {
        const newRow: CollectionItemType[] = [];
        let rowItems: number = 0;
        switch (true) {
          case i < 2:
            rowItems = 5;
            size = "200px";
            break;
          case i >= 2 && i < 5:
            rowItems = 6;
            size = "165px";
            break;
          case i >= 4 && i < 7:
            rowItems = 10;
            size = "95px";
            break;
          case i >= 7:
            rowItems = 14;
            size = "65px";
        }
        for (let j = 0; j < rowItems; j++) {
          if (addedItems) {
            if (addedItems.hasOwnProperty(position)) {
              const newItem: CollectionItemType = Object.assign(
                {},
                {
                  ...addedItems[position as keyof AddedItemsType],
                  position,
                  size,
                }
              );
              newRow.push({ ...newItem });
            } else {
              newRow.push({
                id: uuidv4(),
                albumName: "",
                artist: "",
                url: "",
                position,
                size: size,
              });
            }
          } else {
            newRow.push({
              id: uuidv4(),
              albumName: "",
              artist: "",
              url: "",
              position,
              size: size,
            });
          }
          position++;
        }
        newGrid.push(newRow);
      }
      return newGrid;
    case "collage":
      if (!rows || !columns) return newGrid;
      for (let i = 0; i < rows; i++) {
        const newRow: CollectionItemType[] = [];
        size = "200px";
        for (let j = 0; j < columns; j++) {
          if (addedItems) {
            if (addedItems.hasOwnProperty(position)) {
              const newItem: CollectionItemType = Object.assign(
                {},
                {
                  ...addedItems[position as keyof AddedItemsType],
                  position,
                  size,
                }
              );
              newRow.push({ ...newItem });
            } else {
              newRow.push({
                id: uuidv4(),
                albumName: "",
                artist: "",
                url: "",
                position,
                size: size,
              });
            }
          } else {
            newRow.push({
              id: uuidv4(),
              albumName: "",
              artist: "",
              url: "",
              position,
              size: size,
            });
          }
          position++;
        }
        newGrid.push(newRow);
      }
      return newGrid;
    default:
      return newGrid;
  }
};
