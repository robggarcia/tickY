require("dotenv").config();
const client = require("../../db");
const { getAllTickets } = require("../../db/tickets");
const { createFakeTicket } = require("../helpers");

describe("DB Tickets", () => {
  describe("getAllTickets", () => {
    it("selects and returns an array of all tickets", async () => {
      await createFakeTicket();
      const tickets = await getAllTickets();
      console.log("GET ALL TICKETS: ", tickets);
      const { rows: ticketsFromDatabase } = await client.query(`
            SELECT * FROM tickets;`);
      expect(tickets).toEqual(ticketsFromDatabase);
    });
  });
});
