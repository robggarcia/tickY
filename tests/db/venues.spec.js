require("dotenv").config();
const faker = require("faker");
const client = require("../../db");
const { getVenues, createVenue, updateVenue } = require("../../db/venues");
const { createFakeVenue } = require("../helpers");

describe("DB Venues", () => {
  describe("getVenues", () => {
    it("selects and returns an array of all venues", async () => {
      await createFakeVenue();
      const venues = await getVenues();
      const { rows: venuesFromDatabase } = await client.query(`
            SELECT * FROM venues;`);
      expect(venues).toEqual(venuesFromDatabase);
    });
  });

  describe("getVenueById", () => {
    it("gets venues by their id", async () => {
      const fakeVenue = {
        name: faker.address.streetName(),
        city: faker.address.city(),
        state: faker.address.state(),
        capacity: faker.datatype.number(1000),
      };

      const venue = await getVenueById(fakeVenue.id);

      expect(venue.id).toEqual(fakeVenue.id);
      expect(venue.name).toEqual(fakeVenue.name);
      expect(venue.description).toEqual(fakeVenue.description);
    });
  });

  describe("getVenueByName", () => {
    it("gets an venue by their name", async () => {
      const fakeVenue = {
        name: faker.address.streetName(),
        city: faker.address.city(),
        state: faker.address.state(),
        capacity: faker.datatype.number(1000),
      };
      const venue = await getVenueByName(fakeVenue.name);
      expect(venue.id).toEqual(fakeVenue.id);
    });
  });

  describe("createVenue", () => {
    it("Creates and returns the new venue", async () => {
      const venueToCreate = {
        name: faker.address.streetName(),
        city: faker.address.city(),
        state: faker.address.state(),
        capacity: faker.datatype.number(1000),
      };
      const createdVenue = await createVenue(venueToCreate);
      expect(createdVenue.name).toBe(venueToCreate.name);
      expect(createdVenue.description).toBe(venueToCreate.description);
    });
  });

  describe("updateVenue", () => {
    it("Updates name without affecting the ID. Returns the updated Venue.", async () => {
      const fakeVenue = await createFakeVenue(
        faker.address.streetName(),
        faker.address.city(),
        faker.address.state(),
        faker.datatype.number(1000)
      );
      const name = "Silly Bumpkins";
      const updatedVenue = await updateVenue({ id: fakeVenue.id, name });
      expect(updatedVenue.id).toEqual(fakeVenue.id);
      expect(updatedVenue.name).toEqual(name);
      expect(updatedVenue.description).toEqual(fakeVenue.description);
    });

    it("Updates description without affecting the ID. Returns the updated Venue.", async () => {
      const fakeVenue = await createFakeVenue(
        faker.address.streetName(),
        faker.address.city(),
        faker.address.state(),
        faker.datatype.number(1000)
      );
      const description = "Kings of Grunge!";
      const updatedVenue = await updateVenue({
        id: fakeVenue.id,
        description,
      });
      expect(updatedVenue.id).toEqual(fakeVenue.id);
      expect(updatedVenue.name).toEqual(fakeVenue.name);
      expect(updatedVenue.description).toEqual(description);
    });
  });
});
