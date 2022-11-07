const { create } = require("domain");
const client = require(".");
const { createArtists } = require("./artists");
const { createOrder } = require("./order");
const { createTickets } = require("./tickets");
const { createTicketOrders } = require("./tickets_orders");
const { createUser } = require("./users");
const { createVenue } = require("./venues");

const dropTables = async () => {
  console.log("Dropping All Tables...");
  // drop all tables, in the correct order
  try {
    await client.query(`
        DROP TABLE IF EXISTS tickets_orders;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS tickets;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS artists;
        DROP TABLE IF EXISTS venues;
    `);
  } catch (error) {
    console.error("Error while dropping tables");
    throw error;
  }
};

const createTables = async () => {
  console.log("Creating all tables...");
  try {
    await client.query(`
            CREATE TABLE users(
              id SERIAL PRIMARY KEY,
              username VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              email VARCHAR(255) UNIQUE NOT NULL,
              admin BOOLEAN DEFAULT false
            );
                
            CREATE TABLE venues (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) UNIQUE NOT NULL,
              city VARCHAR(255) NOT NULL,
              state VARCHAR(255) NOT NULL,
              capacity INTEGER NOT NULL
            );

            CREATE TABLE artists(
              id SERIAL PRIMARY KEY,
              genre VARCHAR(255) NOT NULL,
              image VARCHAR(255) NOT NULL,
              name VARCHAR(255) NOT NULL,
              description VARCHAR(255) NOT NULL
            );

            CREATE TABLE tickets(
              id SERIAL PRIMARY KEY,
              "artistId" INTEGER REFERENCES artists(id),
              "venueId" INTEGER REFERENCES venues(id),
              date DATE NOT NULL, 
              price DECIMAL(10, 2) NOT NULL,
              quantity INTEGER NOT NULL,
              "seatTier" BOOLEAN DEFAULT false
            );      
    
            CREATE TABLE orders(
              id SERIAL PRIMARY KEY,
              "userId" INTEGER REFERENCES users(id),
              purchased BOOLEAN DEFAULT false
            );
              
            CREATE TABLE tickets_orders (
              id SERIAL PRIMARY KEY,
              "orderId" INTEGER REFERENCES orders(id),
              "ticketId" INTEGER REFERENCES tickets(id),
              quantity INTEGER NOT NULL
            ); 
    `);
  } catch (error) {
    console.error("Error building tables");
    throw error;
  }
};

// create initial tickets data

async function createInitialTickets() {
  console.log("Creating initial tickets...");
  try {
    const ticketsToCreate = [
      {
        artistId: 1,
        venueId: 1,
        date: "2023-01-23",
        quantity: 504,
        seatTier: false,
        price: 15.0,
      },
      {
        artistId: 2,
        venueId: 2,
        date: "2024-02-01",
        quantity: 242,
        seatTier: false,
        price: 200.01,
      },
      {
        artistId: 2,
        venueId: 3,
        date: "2024-02-14",
        quantity: 0,
        seatTier: false,
        price: 220,
      },
      {
        artistId: 3,
        venueId: 3,
        date: "2022-12-24",
        quantity: 600,
        seatTier: true,
        price: 224.22,
      },
    ];

    const tickets = await Promise.all(ticketsToCreate.map(createTickets));

    console.log("tickets Created:");
    console.log(tickets);
    console.log("Finished creating tickets!");
  } catch (error) {
    console.error("Error creating tickets!");
    throw error;
  }
}

// create initial order data
async function createInitialTicketOrder() {
  try {
    console.log("Starting to create orders...");

    const ticketOrdersToCreate = [
      {
        ticketId: 1,
        orderId: 1,
        quantity: 11,
      },
      {
        ticketId: 2,
        orderId: 1,
        quantity: 13,
      },
      {
        ticketId: 2,
        orderId: 2,
        quantity: 4,
      },
      {
        ticketId: 3,
        orderId: 3,
        quantity: 21,
      },
    ];

    const ticketOrders = await Promise.all(
      ticketOrdersToCreate.map(createTicketOrders)
    );

    console.log("Ticket Orders created:");
    console.log(ticketOrders);
    console.log("Finished creating Ticket orders");
  } catch (error) {
    console.error("Could not build Ticket orders");
    throw error;
  }
}
// create initial user data
async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      {
        username: "Rob",
        password: "password1",
        email: "emailtest@gmail.com",
        admin: false,
      },
      {
        username: "Jon",
        password: "groupticky2pass",
        email: "jon@gmail.com",
        admin: false,
      },
      {
        username: "Max",
        password: "password2",
        email: "max@gmail.com",
        admin: true,
      },
    ];
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialArtists() {
  console.log("Starting to create artists...");
  try {
    const artistsToCreate = [
      {
        name: "Drake",
        genre: "rap",
        description: "big time rapper from canada",
        image:
          "https://media.gq.com/photos/57d9b957436f78925d2b25a7/16:9/w_2560%2Cc_limit/GettyImages-603117346.jpg",
      },
      {
        name: "Mozart",
        genre: "classical",
        image:
          "https://cdn.getyourguide.com/img/tour/56cc30298b69d.jpeg/145.jpg",
        description:
          "Despite his short life, his rapid pace of composition resulted in more than 800 works of virtually every genre of his time.",
      },
      {
        name: "Justin bieber",
        genre: "pop",
        image:
          "https://cache.umusic.com/_sites/_halo/justinbieber/images/v3/jb-tour-header-mobile.jpg",
        description:
          "Canadian singer and teen idol whose fresh-faced good looks and appealing pop songs sparked a global craze beginning in 2009.",
      },
    ];
    const artists = await Promise.all(artistsToCreate.map(createArtists));

    console.log("Artists created:");
    console.log(artists);
    console.log("Finished creating artists!");
  } catch (error) {
    console.error("Error creating artists!");
    throw error;
  }
}
// create initial venues
async function createInitialVenues() {
  console.log("Starting to create venues...");
  try {
    const venuesToCreate = [
      {
        name: "Knitting Factory",
        city: "New York",
        state: "NY",
        capacity: 999,
      },
      {
        name: "Rickshaw Stop",
        city: "San Francisco",
        state: "CA",
        capacity: 400,
      },
      { name: "Lincoln Hall", city: "Chicago", state: "IL", capacity: "507" },
    ];
    const venues = await Promise.all(venuesToCreate.map(createVenue));

    console.log("venues created: ", venues);

    console.log("Finished creating venues!");
  } catch (error) {
    console.error("Error creating venues");
    throw error;
  }
}

// create initial orders
async function createInitialOrders() {
  console.log("Creating initial orders...");
  try {
    const ordersToCreate = [
      {
        userId: 1,
        purchased: true,
      },
      {
        userId: 2,
        purchased: false,
      },
      {
        userId: 3,
        purchased: true,
      },
    ];
    const orders = await Promise.all(ordersToCreate.map(createOrder));

    console.log("Orders created: ", orders);

    console.log("Finished creating orders!");
  } catch (error) {
    console.log("Error in createInitialOrders");
    throw error;
  }
}

const seedDB = async () => {
  console.log("Seeding Database...");
  try {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialArtists();
    await createInitialVenues();
    await createInitialTickets();
    await createInitialOrders();
    await createInitialTicketOrder();
    console.log("DB seeded");
  } catch (error) {
    console.error("Error seeding tables");
    throw error;
  }
};

// seedDB();

module.exports = {
  seedDB,
  dropTables,
  createTables,
};
