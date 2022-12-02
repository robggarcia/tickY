require("dotenv").config();
const request = require("supertest");
const { app, appServer } = require("../..");
const { createTicket } = require("../../db/tickets");
const { TicketNotFoundError, ExistingTicketError } = require("../../errors");
const {
  expectNotToBeError,
  expectToHaveErrorMessage,
} = require("../expectHelpers");
const {
  createFakeAdmin,
  createFakeTicketWithArtistAndVenue,
  createFakeArtist,
  createFakeVenue,
} = require("../helpers");

afterAll(() => {
  console.log("tests finished running");
  appServer.close();
});

describe("api/tickets", () => {
  // GET /api/tickets
  describe("GET api/tickets", () => {
    it("returns an array of all tickets in the database", async () => {
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fakeTicket = fakeTickets[0];
      const response = await request(app).get(`/api/tickets`);
      expectNotToBeError(response.body);
      expect(response.body[0].artistId).toEqual(fakeTicket.artistId);
    });
  });

  // GET /api/tickets/:ticketId
  describe("GET api/tickets/:ticketId", () => {
    it("returns an error if the ticket Id does not exist", async () => {
      const response = await request(app).get(`/api/tickets/1000`);
      expectToHaveErrorMessage(response.body, TicketNotFoundError(1000));
    });
    it("includes the venue data that matches venueId", async () => {
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fakeTicket = fakeTickets[0];
      const fakeVenue = fakeTicket.venue;
      const response = await request(app).get(`/api/tickets/${fakeTicket.id}`);
      expectNotToBeError(response.body);
      expect(response.body.venueId).toEqual(fakeVenue.id);
    });
    it("includes the artist data that matches artistId", async () => {
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fakeTicket = fakeTickets[0];
      const fakeArtist = fakeTicket.artist;
      const response = await request(app).get(`/api/tickets/${fakeTicket.id}`);
      expectNotToBeError(response.body);
      expect(response.body.artistId).toEqual(fakeArtist.id);
    });
  });

  // POST /api/tickets
  describe("POST api/tickets (**)", () => {
    it("admin is able to create a new ticket", async () => {
      const { token } = await createFakeAdmin();
      const fakeArtist = await createFakeArtist();
      const fakeVenue = await createFakeVenue();
      const newTicketData = {
        artistId: fakeArtist.id,
        venueId: fakeVenue.id,
        date: "2024-02-22T05:00:00.000Z",
        price: "40.00",
        quantity: 100,
      };
      const response = await request(app)
        .post(`/api/tickets`)
        .set("Authorization", `Bearer ${token}`)
        .send(newTicketData);
      expectNotToBeError(response.body);
      expect(response.body).toMatchObject(newTicketData);
    });
    it("responds with an error if the ticket already exists", async () => {
      const { token } = await createFakeAdmin();
      const fakeArtist = await createFakeArtist();
      const fakeVenue = await createFakeVenue();
      const newTicketData = {
        artistId: fakeArtist.id,
        venueId: fakeVenue.id,
        date: "02-22-2024",
        price: 40.0,
        quantity: 100,
      };
      await createTicket(newTicketData);
      const response = await request(app)
        .post(`/api/tickets`)
        .set("Authorization", `Bearer ${token}`)
        .send(newTicketData);
      expectToHaveErrorMessage(
        response.body,
        ExistingTicketError(newTicketData.date)
      );
    });
  });

  // PATCH /api/tickets/:ticketId
  describe("PATCH api/tickets/:ticketId", () => {
    it("admin is able to update a ticket", async () => {
      const { token } = await createFakeAdmin();
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fakeTicket = fakeTickets[0];
      const newFakeArtist = await createFakeArtist();
      const fakeTicketData = {
        artistId: newFakeArtist.id,
        price: "1.00",
      };
      const response = await request(app)
        .patch(`/api/tickets/${fakeTicket.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(fakeTicketData);
      expectNotToBeError(response.body);
      expect(response.body.artistId).toEqual(fakeTicketData.artistId);
      expect(response.body.price).toEqual(fakeTicketData.price);
    });
    it("returns an error when trying to update a ticket id that doest not exist", async () => {
      const { token } = await createFakeAdmin();
      const fakeTicketData = {
        artistId: 1,
        price: 1.0,
      };
      const response = await request(app)
        .patch(`/api/tickets/1000`)
        .set("Authorization", `Bearer ${token}`)
        .send(fakeTicketData);

      expectToHaveErrorMessage(response.body, TicketNotFoundError(1000));
    });
    it("returns an error when the updated ticket information already exists", async () => {
      const { token } = await createFakeAdmin();
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fakeTicket = fakeTickets[0];
      const secondFakeTicket = fakeTickets[1];
      const fakeTicketData = {
        venueId: fakeTicket.venueId,
        artistId: fakeTicket.artistId,
        date: fakeTicket.date,
      };
      const response = await request(app)
        .patch(`/api/tickets/${secondFakeTicket.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(fakeTicketData);
      expectToHaveErrorMessage(
        response.body,
        ExistingTicketError(fakeTicketData.date)
      );
    });
  });
  // DELETE /api/tickets/:ticketId
  describe("DELETE /api/tickets/:ticketId", () => {
    it("admin can delete a ticket", async () => {
      const { token } = await createFakeAdmin();
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fakeTicket = fakeTickets[0];
      const response = await request(app)
        .delete(`/api/tickets/${fakeTicket.id}`)
        .set("Authorization", `Bearer ${token}`);
      expectNotToBeError(response.body);
      expect(response.body).toEqual(arrayContaining([fakeTicket]));
    });
    it("returns an error when deleting a ticket that does not exist", async () => {
      const { token } = await createFakeAdmin();
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fakeTicket = fakeTickets[0];

      const response = await request(app)
        .delete(`/api/tickets/1000`)
        .set("Authorization", `Bearer ${token}`);
      expectToHaveErrorMessage(response.body, TicketNotFoundError(1000));
    });
  });
});
