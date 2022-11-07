require("dotenv").config();
const faker = require("faker");
const client = require("../../db");
const { getArtists, updateArtist } = require("../../db/artists");
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

  describe("updateArtist", () => {
    it("Updates name without affecting the ID. Returns the updated Artist.", async () => {
      const fakeArtist = await createFakeArtist({
        name: "Smashing Pumpkins",
        genre: faker.music.genre(),
        image: faker.image.imageUrl(),
        description: faker.lorem.sentence(),
      });
      const name = "Silly Bumpkins";
      const updatedArtist = await updateArtist({ id: fakeArtist.id, name });
      expect(updatedArtist.id).toEqual(fakeArtist.id);
      expect(updatedArtist.name).toEqual(name);
      expect(updatedArtist.description).toEqual(fakeArtist.description);
    });
  });
});
