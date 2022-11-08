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
    fakeSoldOutTicket = fakeData.fakeTickets[2];
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

  describe("getAllOrders", () => {});
  describe("getOrderById", () => {});
  describe("createOrder", () => {});
  describe("updateOrder", () => {});
});
