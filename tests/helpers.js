const faker = require("faker");
const { createArtist } = require("../db/artists");
const { createOrder } = require("../db/order");
const { createTicket } = require("../db/tickets");
const { createTicketOrder } = require("../db/tickets_orders");
const { createUser } = require("../db/users");
const { createVenue } = require("../db/venues");

const createFakeUser = async (
  username = faker.internet.userName(),
  password = faker.internet.password(),
  email = faker.internet.email(),
  admin = faker.datatype.boolean()
) => {
  const fakeUserData = {
    username,
    password,
    email,
    admin,
  };
  const user = await createUser(fakeUserData);
  if (!user) {
    throw new Error("createUser didn't return a user");
  }
  return user;
};

const createFakeArtist = async (
  name = faker.name.findName(),
  genre = faker.music.genre(),
  image = faker.image.imageUrl(),
  description = faker.lorem.sentence()
) => {
  const artist = await createArtist({ name, genre, image, description });
  if (!artist) {
    throw new Error("createArtists didn't return a artist");
  }
  return artist;
};

const createFakeVenue = async (
  name = faker.address.streetName(),
  city = faker.address.city(),
  state = faker.address.state(),
  capacity = faker.datatype.number(1000)
) => {
  const venue = await createVenue({ name, city, state, capacity });
  if (!venue) {
    throw new Error("createVenue didn't return a venue");
  }
  return venue;
};

const createFakeTicket = async ({ artistId, venueId }) => {
  const fakeTicketData = {
    date: "2024-09-13",
    quantity: faker.datatype.number(100),
    seatTier: faker.datatype.boolean(),
    price: faker.datatype.number(100),
  };
  fakeTicketData.artistId = artistId;
  fakeTicketData.venueId = venueId;
  const ticket = await createTicket(fakeTicketData);
  if (!ticket) {
    throw new Error("createTicket didn't return a ticket");
  }
  return ticket;
};

const createFakeOrder = async (
  userId = fakeUser.id,
  purchased = faker.datatype.boolean()
) => {
  const order = await createOrder({ userId, purchased });
  if (!order) {
    throw new Error("createOrder didn't return a order");
  }
  return order;
};

const createFakeTicketOrder = async ({
  orderId,
  ticketId,
  quantity = faker.datatype.number(10),
}) => {
  const order = await createTicketOrder({ orderId, ticketId, quantity });
  if (!order) {
    throw new Error("createTicketOrders didn't return a ticket_order");
  }
  return order;
};

const createFakeTicketWithArtistAndVenue = async (numTickets = 2) => {
  const fakeTickets = [];
  const fakeArtists = [];
  const fakeVenues = [];
  const fakeSoldOutTickets = [];
  const fakeTicketOrders = [];

  const fakeUser = await createFakeUser();

  for (let i = 0; i < numTickets; i++) {
    const fakeArtist = await createFakeArtist();
    fakeArtists.push(fakeArtist);
    const fakeVenue = await createFakeVenue();
    fakeVenues.push(fakeVenue);
    const fakeTicket = await createFakeTicket({
      artistId: fakeArtist.id,
      venueId: fakeVenue.id,
    });
    fakeTicket.artist = fakeArtist;
    fakeTicket.venue = fakeVenue;
    fakeTickets.push(fakeTicket);
    const fakeOrder = await createFakeOrder(fakeUser.id);
    const fakeTicketOrder = await createFakeTicketOrder({
      orderId: fakeOrder.id,
      ticketId: fakeTicket.id,
    });
    fakeTicketOrders.push(fakeTicketOrder);
  }

  const fakeSoldOutArtist = await createFakeArtist();
  fakeArtists.push(fakeSoldOutArtist);
  const fakeSoldOutVenue = await createFakeVenue();
  fakeVenues.push(fakeSoldOutVenue);
  const fakeSoldOutTicket = await createFakeTicket({
    artistId: fakeSoldOutArtist.id,
    venueId: fakeSoldOutVenue.id,
  });
  fakeSoldOutTicket.artist = fakeSoldOutArtist;
  fakeSoldOutTicket.venue = fakeSoldOutVenue;
  fakeSoldOutTicket.quantity = 0;
  fakeSoldOutTickets.push(fakeSoldOutTicket);

  return {
    fakeArtists,
    fakeVenues,
    fakeTickets,
    fakeSoldOutTicket,
    fakeTicketOrders,
  };
};

module.exports = {
  createFakeUser,
  createFakeArtist,
  createFakeTicket,
  createFakeVenue,
  createFakeTicketWithArtistAndVenue,
};
