const { create } = require("domain");
const client = require(".");
const { createArtists } = require("./artists");
const { createUser } = require("./users");

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

// create initial ticket data

// create initial user data
async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      { username: "Rob", password: "password1", email: "emailtest@gmail.com" },
      { username: "Jon", password: "groupticky2pass", email: "jon@gmail.com" },
      { username: "Max", password: "password2", email: "max@gmail.com" },
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
  console.log("Starting to create users...");
  try {
    const artistsToCreate = [
      {
        name: "Drake",
        genre: "rap",
        description: "big time rapper from canada",
        image:
          " https://i.pinimg.com/736x/52/ac/99/52ac99c15349b5d678001f83e4ac283e--laughing-so-hard-cant-stop-laughing.jpg",
      },
      { name: "Mozart", genre: "classical" },
      { name: "Justin bieber" },
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
const seedDB = async () => {
  console.log("Seeding Database...");
  try {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialArtists();
    console.log("DB seeded");
  } catch (error) {
    console.error("Error seeding tables");
    throw error;
  }
};

seedDB();
