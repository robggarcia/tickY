require("dotenv").config();
const request = require("supertest");
const { app, appServer } = require("../..");
const { NonExistingOrderError } = require("../../errors");
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
    it("returns an error if the ticket id is not specified", async () => {});
    it(`returns an error if the order id does not exist`, async () => {});
    it(`attaches a ticket to an order`, async () => {
      const { fakeUser, token } = await createFakeUserWithToken();

      const order = await createFakeOrder(fakeUser.id);
    });
  });

  // PATCH api/tickets_orders/:ticketOrderId
  describe("PATCH api/tickets_orders/:ticketOrderId", () => {
    it("logged in user can update a ticket order", async () => {});
    it("returns an error when updating a ticket order that does not exist", async () => {});
  });

  // DELETE api/tickets_orders/:ticketOrderId
  describe("DELETE api/tickets_orders/:ticketOrderId", () => {
    it("logged in user can delete a ticket order", async () => {});
    it("returns an error when deleting a ticket order that does not exist", async () => {});
  });
});
