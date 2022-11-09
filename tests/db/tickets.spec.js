require("dotenv").config();
const faker = require("faker");
const client = require("../../db");
const {
  getAllTickets,
  getAllUnsoldTickets,
  getTicketsByArtist,
  getTicketsByVenue,
  deleteTicket,
  updateTicket,
} = require("../../db/tickets");
const {
  createFakeTicket,
  createFakeTicketWithArtistAndVenue,
  createFakeArtist,
  createFakeVenue,
  attachFakeArtistAndFakeVenueToFakeTicket,
} = require("../helpers");

// Expect Helper Functions

function expectTicketsToContainTicket(tickets, fakeTicket) {
  expect(tickets).toEqual(expect.any(Array));
  const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
  expect(ticket.id).toEqual(fakeTicket.id);
  expect(ticket.artistId).toEqual(fakeTicket.artistId);
  expect(ticket.venueId).toEqual(fakeTicket.venueId);
  expect(ticket.date).toEqual(fakeTicket.date);
  expect(ticket.price).toEqual(fakeTicket.price);
  expect(ticket.quantity).toEqual(fakeTicket.quantity);
  expect(ticket.seatTier).toEqual(fakeTicket.seatTier);
}

function expectTicketsNotToContainTicket(tickets, fakeSoldOutTicket) {
  const ticket = tickets.find((ticket) => ticket.id === fakeSoldOutTicket.id);
  expect(ticket).toBeFalsy();
}

function expectTicketToContainArtist(ticket, fakeArtist) {
  const artist = ticket.artist;
  expect(artist).toMatchObject({
    id: fakeArtist.id,
    name: fakeArtist.name,
    genre: fakeArtist.genre,
    image: fakeArtist.image,
    description: fakeArtist.description,
  });
}

function expectTicketsNotToContainArtist(tickets, fakeArtist) {
  const ticket = tickets.find((ticket) => ticket.artistId === fakeArtist.id);
  expect(ticket).toBeFalsy();
}

function expectTicketToContainVenue(ticket, fakeVenue) {
  const venue = ticket.venue;
  expect(venue).toEqual(
    objectContaining({
      id: fakeVenue.id,
      name: fakeVenue.name,
      city: fakeVenue.city,
      state: fakeVenue.state,
      capacity: fakeActivity.capacity,
    })
  );
}

function expectTicketsNotToContainVenue(tickets, fakeVenue) {
  const ticket = tickets.find((ticket) => ticket.venueId === fakeVenue.id);
  expect(ticket).toBeFalsy();
}

function expectTicketsNotToContainDuplicates(tickets, fakeTicket) {
  // Use filter to find out how many tickets with the id
  // of our initial fake ticket are in the results.
  const matchingTickets = tickets.filter(
    (ticket) => ticket.id === fakeTicket.id
  );
  // There should only be one.
  expect(matchingTickets.length).toEqual(1);
}

describe("DB Tickets", () => {
  let fakeTicket,
    fakeTicket2,
    fakeSoldOutTicket,
    fakeArtist,
    fakeArtist2,
    fakeSoldOutArtist,
    fakeVenue,
    fakeVenue2,
    fakeSoldOutVenue,
    fakeTicketOrder,
    fakeTicketOrder2;

  beforeEach(async () => {
    const fakeData = await createFakeTicketWithArtistAndVenue();
    fakeTicket = fakeData.fakeTickets[0];
    fakeTicket2 = fakeData.fakeTickets[1];
    fakeSoldOutTicket = fakeData.fakeSoldOutTickets[0];
    fakeArtist = fakeData.fakeArtists[0];
    fakeArtist2 = fakeData.fakeArtists[1];
    fakeSoldOutArtist = fakeData.fakeArtists[2];
    fakeVenue = fakeData.fakeVenues[0];
    fakeVenue2 = fakeData.fakeVenues[1];
    fakeSoldOutVenue = fakeData.fakeVenues[2];
    fakeTicketOrder = fakeData.fakeTicketOrders[0];
    fakeTicketOrder2 = fakeData.fakeTicketOrders[1];
  });

  afterAll(async () => {
    client.query(`
      DELETE FROM artists;
      DELETE FROM venues;
      DELETE FROM tickets;
    `);
  });

  describe("getAllTickets", () => {
    it("selects and returns an array of all tickets", async () => {
      const tickets = await getAllTickets();
      console.log("GET ALL TICKETS: ", tickets);
      const { rows: ticketsFromDatabase } = await client.query(`
          SELECT *
          FROM tickets;
        `);
      for (let ticket of ticketsFromDatabase) {
        ticket = await attachFakeArtistAndFakeVenueToFakeTicket(ticket);
      }
      expect(tickets).toEqual(ticketsFromDatabase);
    });

    it("should include the ticket", async () => {
      const tickets = await getAllTickets();
      expectTicketsToContainTicket(tickets, fakeTicket);
    });

    it("includes the artist", async () => {
      const tickets = await getAllTickets();
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expectTicketToContainArtist(ticket, fakeArtist);
    });

    it("should not include a ticket more than once", async () => {
      const tickets = await getAllTickets();
      expectTicketsNotToContainDuplicates(tickets, fakeTicket);
    });

    it("includes artist's name, from artists join", async () => {
      const tickets = await getAllTickets();
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expect(ticket.artist.name).toEqual(fakeArtist.name);
    });

    it("includes venue's name, from venues join", async () => {
      const tickets = await getAllTickets();
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expect(ticket.venue.name).toEqual(fakeVenue.name);
    });
  });

  describe("getAllUnsoldTickets", () => {
    it("should include the ticket", async () => {
      const tickets = await getAllUnsoldTickets();
      expectTicketsToContainTicket(tickets, fakeTicket);
    });

    it("should not contain the sold out ticket", async () => {
      const tickets = await getAllUnsoldTickets();
      console.log("fakeSoldOutTicket", fakeSoldOutTicket);
      expectTicketsNotToContainTicket(tickets, fakeSoldOutTicket);
    });

    it("includes the artist", async () => {
      const tickets = await getAllUnsoldTickets();
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expectTicketToContainArtist(ticket, fakeArtist);
    });

    it("should not include a ticket more than once", async () => {
      const tickets = await getAllUnsoldTickets();
      expectTicketsNotToContainDuplicates(tickets, fakeTicket);
    });

    it("includes artist's name, from artists join", async () => {
      const tickets = await getAllTickets();
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expect(ticket.artist.name).toEqual(fakeArtist.name);
    });

    it("includes venue's name, from venues join", async () => {
      const tickets = await getAllTickets();
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expect(ticket.venue.name).toEqual(fakeVenue.name);
    });
  });

  describe("getTicketsByArtist", () => {
    it("should include the not sold out ticket containing a specific artistId", async () => {
      const tickets = await getTicketsByArtist(fakeArtist.id);
      expectTicketToContainArtist(tickets, fakeArtist);
    });

    it("should not include a non sold out ticket containing another artist", async () => {
      const anotherArtist = await createFakeArtist();
      const anotherVenue = await createFakeVenue();
      await createFakeTicket({
        artistId: anotherArtist.id,
        venueId: anotherVenue.id,
      });
      const tickets = await getTicketsByArtist(fakeArtist.id);
      expectTicketsNotToContainArtist(tickets, anotherArtist);
    });

    it("includes the artist", async () => {
      const tickets = await getTicketsByArtist(fakeArtist.id);
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expectTicketToContainArtist(ticket, fakeArtist);
    });

    it("should not include a ticket more than once", async () => {
      const tickets = await getTicketsByArtist(fakeArtist.id);
      expectTicketsNotToContainDuplicates(tickets, fakeTicket);
    });

    it("includes artist's name, from artists join", async () => {
      const tickets = await getAllTickets();
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expect(ticket.artist.name).toEqual(fakeArtist.name);
    });

    it("includes venue's name, from venues join", async () => {
      const tickets = await getAllTickets();
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expect(ticket.venue.name).toEqual(fakeVenue.name);
    });
  });

  describe("getTicketsByVenue", () => {
    it("should include the not sold out ticket containing a specific venueId", async () => {
      const tickets = await getTicketsByVenue(fakeVenue.id);
      expectTicketToContainVenue(tickets, fakeVenue);
    });

    it("should not include a non sold out ticket containing another artist", async () => {
      const anotherArtist = await createFakeArtist();
      const anotherVenue = await createFakeVenue();
      await createFakeTicket({
        artistId: anotherArtist.id,
        venueId: anotherVenue.id,
      });
      const tickets = await getTicketsByVenue(fakeVenue.id);
      expectTicketsNotToContainVenue(tickets, anotherVenue);
    });

    it("includes the artist", async () => {
      const tickets = await getTicketsByVenue(fakeVenue.id);
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expectTicketToContainArtist(ticket, fakeArtist);
    });

    it("should not include a ticket more than once", async () => {
      const tickets = await getTicketsByVenue(fakeVenue.id);
      expectTicketsNotToContainDuplicates(tickets, fakeTicket);
    });

    it("includes artist's name, from artists join", async () => {
      const tickets = await getAllTickets();
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expect(ticket.artist.name).toEqual(fakeArtist.name);
    });

    it("includes venue's name, from venues join", async () => {
      const tickets = await getAllTickets();
      const ticket = tickets.find((ticket) => ticket.id === fakeTicket.id);
      expect(ticket.venue.name).toEqual(fakeVenue.name);
    });
  });

  describe("updateTicket", () => {
    it("Returns the updated ticket", async () => {
      const updatedTicket = await updateTicket({
        id: fakeTicket.id,
        date: "2024-01-01",
        quantity: faker.datatype.number(100),
        seatTier: faker.datatype.boolean(),
        price: faker.datatype.number(100),
      });
      expect(updatedTicket.id).toEqual(fakeTicket.id);
    });

    it("Updates the ticket date, quantity, seatTier, or price as necessary", async () => {
      const quantity = faker.datatype.number(100);
      const price = faker.commerce.price();
      const updatedTicket = await updateTicket({
        id: fakeTicket.id,
        seatTier: false,
        quantity,
        price,
      });
      expect(updatedTicket.seatTier).toBe(false);
      expect(updatedTicket.quantity).toBe(quantity);
      expect(updatedTicket.price).toBe(price);
    });

    it("Does not update fields that are not passed in", async () => {
      const price = faker.commerce.price();
      const updatedTicket = await updateTicket({
        id: fakeTicket.id,
        price,
      });
      expect(updatedTicket.seatTier).toBe(fakeTicket.seatTier);
      expect(updatedTicket.quantity).toBe(fakeTicket.quantity);
      expect(updatedTicket.price).toBe(price);
    });
  });

  describe("deleteTicket", () => {
    it("removes ticket from database", async () => {
      await deleteTicket(fakeTicket.id);
      const {
        rows: [ticket],
      } = await client.query(
        `
          SELECT * 
          FROM tickets
          WHERE id = $1;
        `,
        [fakeTicket.id]
      );
      expect(ticket).toBeFalsy();
    });

    it("Deletes all the tickets_orders whose ticket is the one being deleted.", async () => {
      await deleteTicket(fakeTicket.id);
      const {
        rows: [queriedTicketOrders],
      } = await client.query(
        `
          SELECT *
          from tickets_orders
          WHERE id = $1;
        `,
        [fakeTicketOrder.id]
      );

      expect(queriedTicketOrders).toBeFalsy();
    });
  });
});
