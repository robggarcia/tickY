require("dotenv").config();
const client = require("../../db");
const { getArtists } = require("../../db/artists");
const { createFakeArtist } = require("../helpers");

describe("DB Artists", () => {
  describe("getArtists", () => {
    it("selects and returns an array of all artists", async () => {
      await createFakeArtist();
      const artists = await getArtists();
      const { rows: artistsFromDatabase } = await client.query(`
            SELECT * FROM artists;`);
      expect(artists).toEqual(artistsFromDatabase);
    });
  });
});
