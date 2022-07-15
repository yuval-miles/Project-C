import React, { FC } from "react";
import { useDrag } from "react-dnd";
import Image from "next/image";

export interface ResultItemType {
  url: string;
  artist: string;
  albumName: string;
  positionId?: [number, number];
  position?: number;
}

const ResultItem: FC<ResultItemType> = ({ url, artist, albumName }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "image",
      item: { url, artist, albumName },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [url, artist, albumName]
  );
  return (
    <div ref={drag}>
      <Image src={url} alt="album-image" width={120} height={120} />
    </div>
  );
};

export default React.memo(ResultItem);
