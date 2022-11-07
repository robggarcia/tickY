const faker = require("faker");
const { createArtist } = require("../db/artists");
const { createTickets } = require("../db/tickets");
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
  console.log("FAKE ARTIST CREATED: ", artist);
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
  console.log("FAKE VENUE CREATED: ", venue);
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
  console.log("fakeTicketData", fakeTicketData);
  const ticket = await createTickets(fakeTicketData);
  console.log("NEW TICKET", ticket);
  if (!ticket) {
    throw new Error("createTickets didn't return a ticket");
  }
  return ticket;
};

const createFakeTicketWithArtistAndVenue = async () => {
  const fakeArtist = await createFakeArtist();
  const fakeVenue = await createFakeVenue();
  const fakeTicket = await createFakeTicket({
    artistId: fakeArtist.id,
    venueId: fakeVenue.id,
  });

  return {
    fakeArtist,
    fakeVenue,
    fakeTicket,
  };
};

module.exports = {
  createFakeUser,
  createFakeArtist,
  createFakeTicket,
  createFakeVenue,
};
