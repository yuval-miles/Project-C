import { createRouter } from "../createRouter";
import { z } from "zod";
import axios from "axios";

export const lastfmQuery = createRouter().query("get", {
  input: z.string(),
  async resolve({ input: query }) {
    if (!query) return { message: "success", response: [] };
    const {
      data: {
        results: { albummatches },
      },
    } = await axios.get(
      `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&api_key=82e5673de79a121bfd628c2566e47ec9&format=json`
    );
    return { message: "success", response: albummatches };
  },
});
