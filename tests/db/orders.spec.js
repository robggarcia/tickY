// Expect Helper Functions

const { createFakeUser } = require("../helpers");

function expectOrdersToContainOrder(order, fakeOrder) {
  expect(order).toEqual(expect.any(Array));
  const order = order.find((order) => order.id === fakeOrder.id);
  expect(order.id).toEqual(fakeOrder.id);
  expect(order.name).toEqual(fakeOrder.name);
  expect(order.isPublic).toEqual(fakeOrder.isPublic);
  expect(order.creatorId).toEqual(fakeOrder.creatorId);
  expect(order.goal).toEqual(fakeOrder.goal);
}

function expectOrdersNotToContainDuplicates(orders, fakeOrder) {
  // Use filter to find out how many orders with the id
  // of our initial fake order are in the results.
  const matchingOrders = orders.filter((order) => order.id === fakeOrder.id);
  // There should only be one.
  expect(matchingOrders.length).toEqual(1);
}

// Tests start here
describe("DB Orders", () => {
  let fakeuser,
    fakeOrder,
    fakeVenue,
    fakeTicket,
    fakeArtist1,
    fakeArtist2,
    fakeTicketOrder;

  beforeEach(async () => {
    fakeUser = await createFakeUser();
  });
});
