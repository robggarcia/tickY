require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
const { createFakeUserWithToken, createFakeArtist } = require("../helpers");
const {
  expectToBeError,
  expectNotToBeError,
  expectToHaveErrorMessage,
} = require("../expectHelpers");

const { ArtistExistsError, ArtistNotFoundError } = require("../../errors");

const { arrayContaining } = expect;

describe("api/artists", () => {
  describe("GET api/artists", () => {
    it("Just returns a list of all artists in the database", async () => {
      // Create a fake artist to watch for
      const fakeArtist = await createFakeArtist();
      const response = await request(app).get("/api/activities");
      expectNotToBeError(response.body);
      expect(response.body).toEqual(arrayContaining([fakeArtist]));
    });
  });

  describe("POST /api/artists (*)", () => {
    it("Creates a new artists", async () => {
      const { token } = await createFakeUserWithToken("bob");

      const artistData = {
        name: "The Beatles",
        genre: "pop",
        image: "pic.com",
        description: "love, love me do",
      };

      const response = await request(app)
        .post("/api/artists")
        .send(artistData)
        .set("Authorization", `Bearer ${token}`);

      expectNotToBeError(response.body);

      expect(response.body).toMatchObject(artistData);
    });

    it("responds with an error when a artists already exists with the same name", async () => {
      const { token } = await createFakeUserWithToken("alice");

      await createFakeArtists("Push Ups", "Do 30 reps");

      const artistData = {
        name: "The Beatles",
        genre: "pop",
        image: "pic.com",
        description: "love, love me do",
      };

      const response = await request(app)
        .post("/api/artists")
        .send(artistData)
        .set("Authorization", `Bearer ${token}`);

      expectToHaveErrorMessage(
        response.body,
        ArtistExistsError(artistData.name)
      );
    });
  });

  describe("PATCH /api/artists/:artistId (**)", () => {
    it("Admin can update an artist", async () => {
      const { token } = await createFakeUserWithToken("Allison");
      const fakeArtist = await createFakeArtist();

      const newArtistData = {
        name: "Stone Temple Pilots",
        description: "Grunge Rock Pioneers",
      };

      const response = await request(app)
        .patch(`/api/activities/${fakeArtist.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newArtistData);

      expectNotToBeError(response.body);

      expect(response.body).toEqual({
        id: expect.any(Number),
        ...newArtistData,
      });
    });

    it("returns an error when updating an artist that does not exist", async () => {
      const { token } = await createFakeUserWithToken("Barry");

      const newArtistData = {
        name: "Alien Nose Job",
        description: "Weirdo Punkers",
      };

      const response = await request(app)
        .patch(`/api/activities/10000`)
        .set("Authorization", `Bearer ${token}`)
        .send(newArtistData);

      expectToHaveErrorMessage(response.body, ArtistNotFoundError(10000));
    });

    it("returns an error when changing an artist to have the name of an existing artist", async () => {
      const { token } = await createFakeUserWithToken("Jane");
      const fakeArtist = await createFakeArtist(
        "The Clean",
        "pop",
        "pic.com",
        "New Zealand New Wavers"
      );
      const secondFakeArtist = await createFakeArtist(
        "Toy Love",
        "pop",
        "pic.com",
        "New Zealand New Wavers"
      );

      const newArtistData = {
        name: secondFakeArtist.name,
        description: "Good for the heart",
      };

      const response = await request(app)
        .patch(`/api/activities/${fakeArtist.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newArtistData);

      expectToHaveErrorMessage(
        response.body,
        ArtistExistsError(secondFakeArtist.name)
      );
      expectToBeError(response.body);
    });
  });
});
