const { create } = require("domain");
const client = require(".");
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
                admin BOOLEAN
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
                  genre VARCHAR(255),
                  image VARCHAR(255),
                  name VARCHAR(255) NOT NULL,
                  description VARCHAR(255)
                );

                CREATE TABLE tickets(
                id SERIAL PRIMARY KEY,
                "artistId" INTEGER REFERENCES artists(id),
                "venueId" INTEGER REFERENCES venues(id),
                date DATE NOT NULL, 
                price DECIMAL(10, 2) NOT NULL,
                quantity INTEGER NOT NULL,
                seatTear INTEGER NOT NULL
            );      
    
            CREATE TABLE orders(
              id SERIAL PRIMARY KEY,
              "userId" INTEGER REFERENCES users(id),
              "ticketId" INTEGER REFERENCES tickets(id),
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
  console.log("Starting to create tickets...");
  try {
    const ticketsToCreate = [
      {
        id: 1,
        artistId: 1,
        venueId: 1,
        date: "1-1-2023",
        quantity: 1,
        seatTier: "General Admission",
      },
      {
        id: 2,
        artistId: 2,
        venueId: 2,
        date: "1-2-2023",
        quantity: 13,
        seatTier: "VIP",
      },
      {
        id: 3,
        artistId: 3,
        venueId: 3,
        date: "1-3-2023",
        quantity: 4,
        seatTier: "VIP",
      },
    ];
    console.log("Tickets created:");
    console.log(ticketsToCreate);
    console.log("Finished creating tickets!");
  } catch (error) {
    console.error("Error creating tickets!");
  }
}

// create initial order data
async function createInitialOrder() {
  try {
    console.log("Starting to create orders...");

    const ordersToCreate = [
      {
        id: 1,
        userId: 1,
        ticketId: 1,
        isPurchased: true,
      },
      {
        id: 2,
        userId: 2,
        ticketId: 2,
        isPurchased: false,
      },
      {
        id: 3,
        userId: 3,
        ticketId: 3,
        isPurchased: true,
      },
    ];
    console.log("Orders created:");
    console.log(ordersToCreate);
    console.log("Finished creating orders");
  } catch (error) {
    console.error("Could not build orders");
    throw error;
  }
}
// create initial user data

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

const seedDB = async () => {
  console.log("Seeding Database...");
  try {
    await dropTables();
    await createTables();
    await createInitialVenues();
    await createInitialTickets();
    await createInitialOrder();
    console.log("DB seeded");
  } catch (error) {
    console.error("Error seeding tables");
    throw error;
  }
};

seedDB();
