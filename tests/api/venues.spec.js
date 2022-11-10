require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
const { createFakeUserWithToken, createFakeVenue } = require("../helpers");
const {
  expectToBeError,
  expectNotToBeError,
  expectToHaveErrorMessage,
} = require("../expectHelpers");

const { VenueExistsError, VenueNotFoundError } = require("../../errors");

const { arrayContaining } = expect;

describe("api/venues", () => {
  describe("GET api/venues", () => {
    it("Just returns a list of all venues in the database", async () => {
      // Create a fake venue to watch for
      const fakeVenue = await createFakeVenue();
      const response = await request(app).get("/api/venues");
      expectNotToBeError(response.body);
      expect(response.body).toEqual(arrayContaining([fakeVenue]));
    });
  });

  describe("POST /api/venues (*)", () => {
    it("Creates a new venues", async () => {
      const { token } = await createFakeUserWithToken("bob");

      const venueData = {
        name: "The Beatles",
        genre: "pop",
        image: "pic.com",
        description: "love, love me do",
      };

      const response = await request(app)
        .post("/api/venues")
        .send(venueData)
        .set("Authorization", `Bearer ${token}`);

      expectNotToBeError(response.body);

      expect(response.body).toMatchObject(venueData);
    });

    it("responds with an error when a venues already exists with the same name", async () => {
      const { token } = await createFakeUserWithToken("alice");

      await createFakevenues("Push Ups", "Do 30 reps");

      const venueData = {
        name: "The Beatles",
        genre: "pop",
        image: "pic.com",
        description: "love, love me do",
      };

      const response = await request(app)
        .post("/api/venues")
        .send(venueData)
        .set("Authorization", `Bearer ${token}`);

      expectToHaveErrorMessage(response.body, VenueExistsError(venueData.name));
    });
  });

  describe("PATCH /api/venues/:venueId (**)", () => {
    it("Admin can update an venue", async () => {
      const { token } = await createFakeUserWithToken("Allison");
      const fakeVenue = await createFakeVenue();

      const newVenueData = {
        name: "Stone Temple Pilots",
        description: "Grunge Rock Pioneers",
      };

      const response = await request(app)
        .patch(`/api/venues/${fakeVenue.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newVenueData);

      expectNotToBeError(response.body);

      expect(response.body).toEqual({
        id: expect.any(Number),
        ...newVenueData,
      });
    });

    it("returns an error when updating an venue that does not exist", async () => {
      const { token } = await createFakeUserWithToken("Barry");

      const newVenueData = {
        name: "Alien Nose Job",
        description: "Weirdo Punkers",
      };

      const response = await request(app)
        .patch(`/api/venues/10000`)
        .set("Authorization", `Bearer ${token}`)
        .send(newVenueData);

      expectToHaveErrorMessage(response.body, VenueNotFoundError(10000));
    });

    it("returns an error when changing an venue to have the name of an existing venue", async () => {
      const { token } = await createFakeUserWithToken("Jane");
      const fakeVenue = await createFakeVenue(
        "The Clean",
        "pop",
        "pic.com",
        "New Zealand New Wavers"
      );
      const secondFakeVenue = await createFakeVenue(
        "Toy Love",
        "pop",
        "pic.com",
        "New Zealand New Wavers"
      );

      const newVenueData = {
        name: secondFakeVenue.name,
        description: "Good for the heart",
      };

      const response = await request(app)
        .patch(`/api/venues/${fakeVenue.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newVenueData);

      expectToHaveErrorMessage(
        response.body,
        VenueExistsError(secondFakeVenue.name)
      );
      expectToBeError(response.body);
    });
  });
});
