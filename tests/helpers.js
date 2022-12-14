const faker = require("faker");
const { createArtist } = require("../db/artists");
const { createOrder } = require("../db/order");
const { createTicket, updateTicket } = require("../db/tickets");
const { createTicketOrder } = require("../db/tickets_orders");
const { createUser } = require("../db/users");
const { createVenue } = require("../db/venues");
const jwt = require("jsonwebtoken");
const client = require("../db/index");
const { JWT_SECRET } = process.env;

const createFakeUser = async (
  username = faker.internet.userName(),
  password = faker.internet.password(),
  email = faker.internet.email()
) => {
  const fakeUserData = {
    username,
    password,
    email,
  };
  const user = await createUser(fakeUserData);
  if (!user) {
    throw new Error("createUser didn't return a user");
  }
  return user;
};

const createFakeAdmin = async (
  username = faker.internet.userName(),
  password = faker.internet.password(),
  email = faker.internet.email(),
  admin = true
) => {
  const {
    rows: [newAdmin],
  } = await client.query(
    `
      INSERT INTO users (username, password, email, admin) 
      VALUES($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING 
      RETURNING id, username, email, admin;
  `,
    [username, password, email, admin]
  );
  console.log("ADMIN CREATED: ", admin);

  const token = jwt.sign(
    { id: newAdmin.id, username: newAdmin.username },
    JWT_SECRET,
    { expiresIn: "1w" }
  );

  return { newAdmin, token };
};

const createFakeUserWithToken = async (username) => {
  const fakeUser = await createFakeUser(username);

  const token = jwt.sign(
    { id: fakeUser.id, username: fakeUser.username },
    JWT_SECRET,
    { expiresIn: "1w" }
  );

  return {
    fakeUser,
    token,
  };
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
  name = faker.name.findName(),
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

async function attachFakeArtistAndFakeVenueToFakeTicket(ticket) {
  const {
    rows: [artist],
  } = await client.query(
    `
    SELECT *
    FROM artists
    WHERE id=$1;
  `,
    [ticket.artistId]
  );
  const {
    rows: [venue],
  } = await client.query(
    `
    SELECT *
    FROM venues
    WHERE id=$1;
  `,
    [ticket.venueId]
  );

  ticket.artist = artist;
  ticket.venue = venue;
  return ticket;
}

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
  await updateTicket({ id: fakeSoldOutTicket.id, quantity: 0 });
  fakeSoldOutTicket.artist = fakeSoldOutArtist;
  fakeSoldOutTicket.venue = fakeSoldOutVenue;
  fakeSoldOutTicket.quantity = 0;
  fakeSoldOutTickets.push(fakeSoldOutTicket);

  return {
    fakeArtists,
    fakeVenues,
    fakeTickets,
    fakeSoldOutTickets,
    fakeTicketOrders,
  };
};

module.exports = {
  createFakeUser,
  createFakeAdmin,
  createFakeUserWithToken,
  createFakeArtist,
  createFakeTicket,
  createFakeVenue,
  createFakeOrder,
  createFakeTicketOrder,
  createFakeTicketWithArtistAndVenue,
  attachFakeArtistAndFakeVenueToFakeTicket,
};
