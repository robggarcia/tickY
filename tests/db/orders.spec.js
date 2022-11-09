require("dotenv").config();
const faker = require("faker");
const client = require("../../db");
const { createFakeOrder, createFakeUser } = require("../helpers");
const { getAllOrders, getOrderById, updateOrder } = require("../../db/order");

describe("DB Orders", () => {
  let fakeUser;

  beforeAll(async () => {
    fakeUser = await createFakeUser();
  });

  afterAll(async () => {
    client.query(`
      DELETE FROM orders;
      DELETE FROM users;
    `);
  });

  describe("getAllOrders", () => {
    it("selects and returns an array of all orders", async () => {
      await createFakeOrder(fakeUser.id);
      const orders = await getAllOrders();
      const { rows: ordersFromDatabase } = await client.query(`
        SELECT * FROM orders;
      `);
      expect(orders).toEqual(ordersFromDatabase);
    });
  });

  describe("getOrderById(id)", () => {
    it("gets orders by their id", async () => {
      const fakeOrder = await createFakeOrder(fakeUser.id);
      const order = await getOrderById(fakeOrder.id);

      expect(order.id).toEqual(fakeOrder.id);
      expect(order.userId).toEqual(fakeOrder.userId);
      expect(order.purchased).toEqual(fakeOrder.purchased);
    });
  });

  describe("createOrder({ userId, purchased })", () => {
    it("Creates and returns the new order", async () => {
      const orderToCreate = {
        userId: fakeOrder.id,
        purchased: faker.datatype.boolean(),
      };
      const createdOrder = await createActivity(orderToCreate);
      expect(createdOrder.userId).toBe(orderToCreate.userId);
      expect(createdOrder.purchased).toBe(orderToCreate.purchased);
    });
  });

  describe("updateOrder({id, purchased})", () => {
    it("Updates purchased without affecting the ID. Returns the updated Order.", async () => {
      const fakeOrder = await createFakeOrder(fakeUser.id, false);
      const purchased = true;
      const updatedOrder = await updateOrder({
        id: fakeOrder.id,
        purchased,
      });
      expect(updatedOrder.id).toEqual(fakeOrder.id);
      expect(updatedOrder.purchased).toEqual(purchased);
      expect(updatedOrder.userId).toEqual(fakeOrder.userId);
    });
  });
});
