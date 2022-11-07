const faker = require("faker");
const { createArtist } = require("../db/artists");
const { createTickets } = require("../db/tickets");
const { createVenue } = require("../db/venues");

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

const createFakeTicket = async () => {
  const fakeTicketData = {
    venueId: faker.datatype.number(100),
    date: "2024-09-13",
    quantity: faker.datatype.number(100),
    seatTier: faker.datatype.boolean(),
    price: faker.datatype.number(100),
  };
  console.log("fakeTicketData", fakeTicketData);
  const ticket = await createTickets(fakeTicketData);
  console.log("NEW TICKET", ticket);
  if (!ticket) {
    throw new Error("createTickets didn't return a ticket");
  }
  return ticket;
};

module.exports = { createFakeArtist, createFakeTicket, createFakeVenue };
