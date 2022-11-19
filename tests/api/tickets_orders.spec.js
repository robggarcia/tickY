require("dotenv").config();
const request = require("supertest");
const { app, appServer } = require("../..");
const {
  NonExistingOrderError,
  NonExistingTicketOrderError,
} = require("../../errors");
const {
  expectNotToBeError,
  expectToHaveErrorMessage,
} = require("../expectHelpers");
const {
  createFakeUser,
  createFakeOrder,
  createFakeUserWithToken,
  createFakeAdmin,
  createFakeTicketWithArtistAndVenue,
  createFakeTicketOrder,
} = require("../helpers");

afterAll(() => {
  console.log("tests finished running");
  appServer.close();
});

describe("api/tickets_orders", () => {
  // GET api/tickets_orders/:ticketOrderId
  describe("GET api/tickets_orders/:ticketOrderId", () => {
    it("a logged in user is able to retrieve a ticket_order", async () => {
      const { fakeUser, token } = await createFakeUserWithToken();
      const ticketOrderData = {
        orderId: 1,
        ticketId: 2,
        quantity: 11,
      };
      const { fakeTicketOrders } = await createFakeTicketWithArtistAndVenue();
      const ticketOrder = fakeTicketOrders[0];
      const response = await request(app)
        .get(`/api/tickets_orders/${ticketOrder.id}`)
        .set("Authorization", `Bearer ${token}`);
      ticketOrderData.id = response.body.id;
      expectNotToBeError(response.body);
      expect(response.body).toEqual(ticketOrder);
    });
  });

  // POST api/tickets_orders
  describe("POST api/tickets_orders", () => {
    it("returns an error if the ticket id is not specified", async () => {
      const ticketOrderData = {
        ticketId: 2,
        quantity: 11,
      };
      const response = await request(app)
        .post("/api/tickets_orders")
        .send(ticketOrderData);
      expectToHaveErrorMessage(response.body, InsuficientInputError());
    });
    it(`returns an error if the order id does not exist`, async () => {
      const ticketOrderData = {
        orderId: 1000,
        ticketId: 2,
        quantity: 11,
      };
      const response = await request(app)
        .post("/api/tickets_orders")
        .send(ticketOrderData);
      expectToHaveErrorMessage(
        response.body,
        NonExistingOrderError(ticketOrderData.orderId)
      );
    });
    it(`attaches a ticket to an order`, async () => {
      const { fakeUser, token } = await createFakeUserWithToken();
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fakeTicket = fakeTickets[0];
      const fakeOrder = await createFakeOrder(fakeUser.id);
      const ticketOrderData = {
        orderId: fakeOrder.id,
        ticketId: fakeTicket.id,
        quantity: 3,
      };
      const response = await request(app)
        .post("/api/tickets_orders")
        .send(ticketOrderData);
      expectNotToBeError(response.body);
      expect(response.body).toEqual(arrayContaining([ticketOrderData]));
    });
  });

  // PATCH api/tickets_orders/:ticketOrderId
  describe("PATCH api/tickets_orders/:ticketOrderId", () => {
    it("a user can update a ticket order", async () => {
      const ticketOrderData = {
        orderId: 1,
        ticketId: 2,
        quantity: 11,
      };
      const updatedTicketOrder = {
        ticketId: 3,
        quantity: 5,
      };
      const fakeTicketOrder = await createFakeTicketOrder(ticketOrderData);
      const response = await request(app)
        .patch(`/api/tickets_orders/${fakeTicketOrder.id}`)
        .send(updatedTicketOrder);
      expectNotToBeError(response.body);
      expect(response.body.ticketId).toEqual(updatedTicketOrder.ticketId);
      expect(response.body.quantity).toEqual(updatedTicketOrder.quantity);
    });
    it("returns an error when updating a ticket order that does not exist", async () => {
      const updatedTicketOrder = {
        orderId: 1,
        ticketId: 1,
        quantity: 5,
      };
      const response = await request(app)
        .patch(`/api/tickets_orders/1000`)
        .send(updatedTicketOrder);
      expectToHaveErrorMessage(
        response.body,
        NonExistingTicketOrderError(1000)
      );
    });
  });

  // DELETE api/tickets_orders/:ticketOrderId
  describe("DELETE api/tickets_orders/:ticketOrderId", () => {
    it("a user can delete a ticket order", async () => {
      const { fakeUser, token } = await createFakeUserWithToken();
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fakeTicket = fakeTickets[0];
      const fakeOrder = await createFakeOrder(fakeUser.id);
      const ticketOrderData = {
        orderId: fakeOrder.id,
        ticketId: fakeTicket.id,
        quantity: 3,
      };
      const fakeTicketOrder = await createFakeTicketOrderticketOrderData;
      const response = await request(app)
        .delete(`/api/tickets_orders/${fakeTicketOrder.id}`)
        .send(ticketOrderData);
      expectNotToBeError(response.body);
      expect(response.body).toEqual(arrayContaining([ticketOrderData]));
    });
    it("returns an error when deleting a ticket order that does not exist", async () => {
      const response = await request(app)
        .delete(`/api/tickets_orders/1000`)
        .send(ticketOrderData);
      expectToHaveErrorMessage(
        response.body,
        NonExistingTicketOrderError(1000)
      );
    });
  });
});
