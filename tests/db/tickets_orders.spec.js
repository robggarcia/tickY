require("dotenv").config();
const faker = require("faker");
const client = require("../../db");

const {
  getTicketOrderById,
  addTicketToOrder,
  editTicketOrder,
  deleteTicketOrder,
} = require("../../db/tickets_orders");

const {
  createFakeTicket,
  createFakeOrder,
  createFakeUser,
} = require("../helpers");

describe("DB Tickets_Orders", () => {
  let fakeUser, fakeTicket, fakeOrder, ticketOrderData;

  beforeAll(async () => {
    const fakeData = await createFakeTicketWithArtistAndVenue();
    fakeTicket = fakeData.fakeTickets[0];
    fakeUser = await createFakeUser();
    fakeOrder = await createFakeOrder(fakeUser.id);
    ticketOrderData = {
      ticketId: fakeTicket.id,
      orderId: fakeOrder.id,
      quantity: faker.random.number(10),
    };
  });

  afterAll(async () => {
    client.query(`
        DELETE FROM tickets_orders;
        DELETE FROM orders;
        DELETE FROM tickets;
        DELETE FROM users;
        DELETE FROM artists;
        DELETE FROM venues;   
    `);
  });

  describe("getTicketOrderById", () => {
    it("should return the ticket order by id", async () => {
      const fakeTicketOrder = await createFakeTicketOrder(ticketOrderData);
      const ticketOrder = await getTicketOrderById(fakeTicketOrder.id);
      expect(ticketOrder.id).toBe(fakeTicketOrder.id);
    });
  });

  describe("addTicketToOrder({orderId, ticketId, quantity})", () => {
    it("creates a new routine_activity, and return it", async () => {
      const ticketOrder = await addTicketToOrder(ticketOrderData);
      expect(ticketOrder.ticketId).toBe(ticketOrderData.ticketId);
      expect(ticketOrder.orderId).toBe(ticketOrderData.orderId);
      expect(ticketOrder.quantity).toBe(ticketOrderData.quantity);
    });
  });

  describe("editTicketOrder({id, quantity})", () => {
    it("Finds the ticket with id equal to the passed in id. Updates the quantity as necessary.", async () => {
      const fakeTicketOrder = await createFakeTicketOrder(ticketOrderData);

      const newTicketOrderData = {
        id: fakeTicketOrder.id,
        quantity: faker.random.number(),
      };
      const updatedTicketOrder = await editTicketOrder(newTicketOrderData);

      expect(updatedTicketOrder.id).toBe(fakeTicketOrder.id);
      expect(updatedTicketOrder.quantity).toBe(newTicketOrderData.quantity);
      expect(updatedTicketOrder.orderId).toBe(newTicketOrderData.orderId);
    });
  });

  //   describe("getTicketOrderByTicket", () => {});

  describe("deleteTicketOrder(id)", () => {
    it("remove ticket_order from database", async () => {
      const fakeTicketOrder = await createFakeTicketOrder(ticketOrderData);

      const deletedTicketOrder = await deleteTicketOrder(fakeTicketOrder.id);
      expect(deletedTicketOrder.id).toBe(fakeTicketOrder.id);
      const { rows } = await client.query(`
            SELECT * FROM routine_activities
            WHERE id = ${deletedTicketOrder.id}
          `);
      expect(rows.length).toBe(0);
    });
  });
});
