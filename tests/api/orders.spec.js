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

describe("api/orders", () => {
  describe("POST api/orders (*)", () => {
    it("creates a new order", async () => {
      const { fakeUser, token } = await createFakeUserWithToken();

      const fakeOrderData = {
        userId: fakeUser.id,
        purchased: false,
      };

      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${token}`)
        .send(fakeOrderData);

      expectNotToBeError(response.body);

      expect(response.body).toMatchObject(fakeOrderData);
    });
  });

  describe(`GET api/orders (**)`, () => {
    it("admin can view all orders in the database", async () => {
      const { token } = await createFakeAdmin();
      const user = await createFakeUser();

      const fakeOrder = await createFakeOrder(user.id);

      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${token}`);

      expectNotToBeError(response.body);

      expect(response.body).toEqual(expect.arrayContaining([fakeOrder]));
    });
  });

  describe(`GET api/orders/:orderId (*)`, () => {
    it("user can view orders they created", async () => {
      const { fakeUser, token } = await createFakeUserWithToken();

      const fakeOrder = await createFakeOrder(fakeUser.id);

      const response = await request(app)
        .get(`/api/orders/${fakeOrder.id}`)
        .set("Authorization", `Bearer ${token}`);

      expectNotToBeError(response.body);

      expect(response.body.id).toEqual(fakeOrder.id);
    });
    it("returns an error when the order does not exist", async () => {
      const { fakeUser, token } = await createFakeUserWithToken();

      const response = await request(app)
        .get(`/api/orders/10000`)
        .set("Authorization", `Bearer ${token}`);

      expectToHaveErrorMessage(response.body, NonExistingOrderError(10000));
    });
  });

  describe(`PATCH api/orders/:orderId (*)`, () => {
    it("Logged in user can update their order", async () => {
      const { fakeUser } = await createFakeUserWithToken();
      const { token } = await createFakeAdmin();

      const newFakeOrderData = {
        purchased: true,
      };

      const order = await createFakeOrder(fakeUser.id);
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fullOrder = createFakeTicketOrder({
        orderId: order.id,
        ticketId: fakeTickets[0].id,
        quantity: 1,
      });

      const response = await request(app)
        .patch(`/api/orders/${order.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newFakeOrderData);

      expectNotToBeError(response.body);

      expect(response.body.id).toEqual(order.id);
    });

    it("returns an error when updating an order that does not exist", async () => {
      const { token } = await createFakeAdmin();

      const newOrderUserData = {
        purchased: true,
      };

      const response = await request(app)
        .patch(`/api/orders/10000`)
        .set("Authorization", `Bearer ${token}`)
        .send(newOrderUserData);

      expectToHaveErrorMessage(response.body, NonExistingOrderError(10000));
    });
  });
});
