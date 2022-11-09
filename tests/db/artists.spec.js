require("dotenv").config();
const faker = require("faker");
const client = require("../../db");
const {
  getArtist,
  updateArtist,
  createArtist,
  getArtistById,
} = require("../../db/artists");
const { createFakeArtist } = require("../helpers");

describe("DB Artists", () => {
  describe("getArtists", () => {
    it("selects and returns an array of all artists", async () => {
      await createFakeArtist();
      const artists = await getArtist();
      const { rows: artistsFromDatabase } = await client.query(`
            SELECT * FROM artists;`);
      expect(artists).toEqual(artistsFromDatabase);
    });
  });

  describe("getArtistById", () => {
    it("gets artists by their id", async () => {
      const fakeArtist = {
        name: "Beyonce",
        genre: faker.music.genre(),
        image: faker.image.imageUrl(),
        description: faker.lorem.sentence(),
      };

      const artist = await getArtistById(fakeArtist.id);

      expect(artist.id).toEqual(fakeArtist.id);
      expect(artist.name).toEqual(fakeArtist.name);
      expect(artist.description).toEqual(fakeArtist.description);
    });
  });

  xdescribe("getArtistByName", () => {
    it("gets an artist by their name", async () => {
      const fakeArtist = {
        name: "Wu Tang",
        genre: faker.music.genre(),
        image: faker.image.imageUrl(),
        description: faker.lorem.sentence(),
      };
      const artist = await getArtistByName(fakeArtist.name);
      expect(artist.id).toEqual(fakeArtist.id);
    });
  });

  describe("createArtist", () => {
    it("Creates and returns the new artist", async () => {
      const artistToCreate = {
        name: "Led Zeppelin",
        genre: faker.music.genre(),
        image: faker.image.imageUrl(),
        description: faker.lorem.sentence(),
      };
      const createdArtist = await createArtist(artistToCreate);
      expect(createdArtist.name).toBe(artistToCreate.name);
      expect(createdArtist.description).toBe(artistToCreate.description);
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

    it("Updates description without affecting the ID. Returns the updated Artist.", async () => {
      const fakeArtist = await createFakeArtist({
        name: "Nirvana",
        genre: faker.music.genre(),
        image: faker.image.imageUrl(),
        description: faker.lorem.sentence(),
      });
      const description = "Kings of Grunge!";
      const updatedArtist = await updateArtist({
        id: fakeArtist.id,
        description,
      });
      expect(updatedArtist.id).toEqual(fakeArtist.id);
      expect(updatedArtist.name).toEqual(fakeArtist.name);
      expect(updatedArtist.description).toEqual(description);
    });
  });
});
