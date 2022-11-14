require("dotenv").config();
const request = require("supertest");
const { app, appServer } = require("../..");
const { createFakeVenue, createFakeAdmin } = require("../helpers");
const {
  expectToBeError,
  expectNotToBeError,
  expectToHaveErrorMessage,
} = require("../expectHelpers");

const { VenueExistsError, VenueNotFoundError } = require("../../errors");

afterAll(() => {
  console.log("tests finished running");
  appServer.close();
});

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
      const { token } = await createFakeAdmin();

      const venueData = {
        name: "Jim's Room",
        city: "Cherry Hill",
        state: "NJ",
        capacity: 20,
      };

      const response = await request(app)
        .post("/api/venues")
        .send(venueData)
        .set("Authorization", `Bearer ${token}`);

      expectNotToBeError(response.body);

      expect(response.body).toMatchObject(venueData);
    });

    it("responds with an error when a venues already exists with the same name", async () => {
      const { token } = await createFakeAdmin();

      await createFakeVenue();

      const venueData = {
        name: "Jim's Room",
        city: "Cherry Hill",
        state: "NJ",
        capacity: 20,
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
      const { token } = await createFakeAdmin();
      const fakeVenue = await createFakeVenue();

      const newVenueData = {
        name: "The Casbah",
        city: "San Diego",
        state: "CA",
        capacity: 200,
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
      const { token } = await createFakeAdmin();

      const newVenueData = {
        name: "Johnny Brenda's",
        city: "Philadelphia",
        state: "PA",
        capacity: 150,
      };

      const response = await request(app)
        .patch(`/api/venues/10000`)
        .set("Authorization", `Bearer ${token}`)
        .send(newVenueData);

      expectToHaveErrorMessage(response.body, VenueNotFoundError(10000));
    });

    it("returns an error when changing an venue to have the name of an existing venue", async () => {
      const { token } = await createFakeAdmin();

      const fakeVenue = await createFakeVenue(
        "Boot and Saddle",
        "Philadelphia",
        "PA",
        "100"
      );
      const secondFakeVenue = await createFakeVenue(
        "Century Bar",
        "Philadelphia",
        "PA",
        "60"
      );

      const newVenueData = {
        name: secondFakeVenue.name,
        city: "Alexandria",
        state: "LA",
        capacity: 230,
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

  describe("DELETE /api/venues/:venueId (**)", () => {
    it("Admin can delete a venue", async () => {
      const { token } = await createFakeAdmin();
      const fakeVenue = await createFakeVenue();

      const response = await request(app)
        .delete(`/api/venues/${fakeVenue.id}`)
        .set("Authorization", `Bearer ${token}`);

      expectNotToBeError(response.body);

      expect(response.body).toEqual(fakeVenue);
    });

    it("returns an error when deleting a venue that does not exist", async () => {
      const { token } = await createFakeAdmin();

      const response = await request(app)
        .delete(`/api/venues/10000`)
        .set("Authorization", `Bearer ${token}`);

      expectToHaveErrorMessage(response.body, VenueNotFoundError(10000));
    });
  });
});
