import { createRouter } from "../createRouter";
import { z } from "zod";
import axios from "axios";

const Albums = z.object({
  album: z.array(
    z.object({
      artist: z.string(),
      image: z.array(z.object({ size: z.string(), "#text": z.string() })),
      mbid: z.string(),
      name: z.string(),
      streamable: z.string(),
      url: z.string(),
    })
  ),
});

type AlbumType = z.infer<typeof Albums>;

export const lastfmRouter = createRouter().query("get", {
  input: z.string(),
  async resolve({ input: query }) {
    try {
      if (!query) return { message: "success", response: "Empty query" };
      const {
        data: {
          results: { albummatches },
        },
      }: { data: { results: { albummatches: AlbumType } } } = await axios.get(
        `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&api_key=82e5673de79a121bfd628c2566e47ec9&format=json`
      );
      Albums.parse(albummatches);
      return { message: "success", response: albummatches };
    } catch (err) {
      return {
        message: "failed",
        response: "Oops Something went wrong... Please try again later",
      };
    }
  },
});
