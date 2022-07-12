import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  message: string;
  response: object | unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { search } = req.query;
    const {
      data: {
        results: { albummatches },
      },
    } = await axios.get(
      `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${search}&api_key=82e5673de79a121bfd628c2566e47ec9&format=json`
    );
    res.status(200).json({ message: "success", response: albummatches });
  } catch (err: unknown) {
    res.status(500).json({ message: "failed", response: err });
  }
}
