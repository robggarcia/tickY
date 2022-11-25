const { create } = require("domain");
const client = require(".");
const { createArtist } = require("./artists");
const { createOrder } = require("./order");
const { createTicket } = require("./tickets");
const { createTicketOrder } = require("./tickets_orders");
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
              quantity INTEGER NOT NULL
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
              quantity INTEGER NOT NULL,
              "seatTier" BOOLEAN DEFAULT false
            ); 
    `);
  } catch (error) {
    console.error("Error building tables");
    throw error;
  }
};

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
        genre: "hip-hop",
        image:
          "https://media.gq.com/photos/57d9b957436f78925d2b25a7/16:9/w_2560%2Cc_limit/GettyImages-603117346.jpg",
        description:
          "Canadian rapper, singer, and actor who first gained recognition by starring as Jimmy Brooks in the CTV teen drama series Degrassi: The Next Generation.",
      },
      {
        name: "Eminem",
        genre: "hip-hop",
        image:
          "https://www.gannett-cdn.com/presto/2022/02/14/USAT/d69e5fe1-9a94-4c1b-a71c-493806d95194-USP_NFL__Super_Bowl_LVI-Los_Angeles_Rams_at_Cincin_9.jpg?width=592&format=pjpg&auto=webp&quality=70",
        description:
          "American rapper and record producer who is credited with popularizing hip hop in middle America and is critically acclaimed as one of the greatests rappers of all time",
      },
      {
        name: "Kanye West",
        genre: "hip-hop",
        image:
          "https://cdn.britannica.com/07/93807-050-5CEF7302/Kanye-West-2006.jpg",
        description:
          "American rapper, songwriter, record producer, and fashion designer who is widely regarded as one of the most influential hip hop artists and producers.",
      },
      {
        name: "Doja Cat",
        genre: "hip-hop",
        image:
          "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F6%2F2022%2F01%2F09%2FDoja-Cat.jpg",
        description:
          "American rapper and singer who began making and releasing music on SoundCloud as a teenager",
      },
      {
        name: "Post Malone",
        genre: "hip-hop",
        image:
          "https://media.cnn.com/api/v1/images/stellar/prod/220918125931-post-malone-fall-st-louis-trnd.jpg?c=original",
        description:
          "American rapper, singer, songwriter, and record producer who is known for his variegated vocals.",
      },
      {
        name: "Travis Scott",
        genre: "hip-hop",
        image:
          "https://www.gannett-cdn.com/presto/2021/11/06/USAT/284899c9-bcb4-4b56-b5df-59d75803d411-GTY_1351603671.jpg",
        description:
          "American rapper, singer, songwriter, and record producer who signed his first major-label contract with Epic Records",
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
      {
        name: "Taylor Swift",
        genre: "pop",
        image: "https://api.time.com/wp-content/uploads/2014/11/458102226.jpg",
        description:
          "American singer-songwriter who's songwriting is isnpired by her personal life.",
      },
      {
        name: "Ed Sheeran",
        genre: "pop",
        image:
          "https://cdn.cnn.com/cnnnext/dam/assets/220114104433-ed-sheeran-2021-restricted-super-tease.jpg",
        description:
          "English singer-songwriter who began writing songs around the age of eleven",
      },
      {
        name: "Sam Smith",
        genre: "pop",
        image:
          "https://static.stereogum.com/uploads/2015/10/GettyImages-488992906-scaled-scaled.jpg",
        description:
          "English singer and song writer who was recognized in October 2012 after featuring on Disclosure's breakthrough single",
      },
      {
        name: "Rihanna",
        genre: "pop",
        image:
          "https://www.nme.com/wp-content/uploads/2016/09/2015rihanna_GettyImages-494142462_11122015.jpg",
        description:
          "Barbadian singer, actress, and businesswomen who gained recognition after the release of her first two studio albums, 'Music of the Sun' and 'A Girl Like Me'",
      },
      {
        name: "Harry Styles",
        genre: "pop",
        image:
          "https://variety.com/wp-content/uploads/2022/11/GettyImages-1393470392.jpg?w=681&h=383&crop=1",
        description:
          "English singer, songwriter, and actor who's musical career began in 2010 as a solo contestant on the British music competition series The X Factor",
      },
      {
        name: "The Weeknd",
        genre: "r&b",
        image:
          "https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2022%2F09%2Fthe-weeknd-vocal-condition-update-following-canceled-la-show-000.jpg?fit=max&cbr=1&q=90&w=750&h=500",
        description:
          "Candian singer, songwriter, and record producer who's know for his song versatility and dark lyricm",
      },
      {
        name: "Beyonce",
        genre: "r&b",
        image:
          "https://static.stacker.com/s3fs-public/styles/1280x720/s3/croppedGettyImages453482991K1ZPjpg_0.JPEG?token=d3qRa5jk",
        description:
          "American singer, songwriter, and actress who is one of the most influential female musician because of her artistry and vocals",
      },
      {
        name: "Brent Faiyaz",
        genre: "r&b",
        image: "https://a.vsstatic.com/cms-uploads/brent-faiyaz-rectangle.jpg",
        description:
          "American R&B singer who rose to prominence after he was featured on the GoldLink single 'Crew'",
      },
      {
        name: "Giveon",
        genre: "r&b",
        image:
          "https://www.rollingstone.com/wp-content/uploads/2021/10/Giveon.jpg",
        description:
          "American singer-songwriter who rose to prominence after his collaboration with Drake on their 2020 single 'Chicago Freestyle'.",
      },
      {
        name: "Chris Brown",
        genre: "r&b",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/6/6a/Chris_Brown_5%2C_2012.jpg",
        description:
          "American singer, songwriter, dancer and actor who is one of the most successful R&B singers of his generation.",
      },
      {
        name: "Bryson Tiller",
        genre: "r&b",
        image:
          "https://www.essence.com/wp-content/uploads/2022/09/bryson-tiller-1-1200x900.jpg",
        description:
          "American singer and rapper who gained mainstream success in 2015 following the release of the single, 'Don't', which reached the top 20 on the Billboard Hot 100.",
      },
      {
        name: "David Guetta",
        genre: "edm",
        image:
          "https://www.radioelvin.com/wp-content/uploads/2020/07/David-Guetta.jpg",
        description:
          "French DJ and music producer who was voted the number one DJ in the DJ Mag Top 100 DJs poll",
      },
      {
        name: "Fred Again..",
        genre: "edm",
        image: "https://i.ytimg.com/vi/ARYM9ebZ6r8/maxresdefault.jpg",
        description:
          "British record producer, singer, songwriter, multi-instrumentalist, and DJ",
      },
      {
        name: "DJ Snake",
        genre: "edm",
        image:
          "https://www.udiscovermusic.com/wp-content/uploads/2022/05/DJ-Snake-Disco-Maghreb-2.jpg",
        description:
          "French music producer and DJ, first achieving international recognition in 2012 by releasing an instrumentation-oriented single called 'Turn Down For What'.",
      },
      {
        name: "Gryffin",
        genre: "edm",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/1/1f/Griffyn_%2843228990201%29.jpg",
        description:
          "American musician, DJ, songwriter, and record producer who gained recognition for remixing some well-known songs.",
      },
    ];
    const artists = await Promise.all(artistsToCreate.map(createArtist));

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
        capacity: 400,
      },
      {
        name: "Radio City Music Hall",
        city: "New York",
        state: "NY",
        capacity: 5960,
      },
      {
        name: "Rickshaw Stop",
        city: "San Francisco",
        state: "CA",
        capacity: 400,
      },
      {
        name: "Great American Music Hall",
        city: "San Francisco",
        state: "CA",
        capacity: 470,
      },
      {
        name: "Lincoln Hall",
        city: "Chicago",
        state: "IL",
        capacity: 507,
      },
      {
        name: "Bottom Lounge",
        city: "Chicago",
        state: "IL",
        capacity: 700,
      },
    ];
    const venues = await Promise.all(venuesToCreate.map(createVenue));

    console.log("venues created: ", venues);

    console.log("Finished creating venues!");
  } catch (error) {
    console.error("Error creating venues");
    throw error;
  }
}

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
        price: 15.0,
      },
      {
        artistId: 2,
        venueId: 2,
        date: "2024-02-01",
        quantity: 242,
        price: 200.01,
      },
      {
        artistId: 2,
        venueId: 3,
        date: "2024-02-14",
        quantity: 20,
        price: 220,
      },
      {
        artistId: 2,
        venueId: 1,
        date: "2022-12-14",
        quantity: 100,
        price: 215,
      },
      {
        artistId: 3,
        venueId: 3,
        date: "2022-12-24",
        quantity: 600,
        price: 224.22,
      },
      {
        artistId: 4,
        venueId: 3,
        date: "2022-12-21",
        quantity: 6030,
        price: 20,
      },
      {
        artistId: 5,
        venueId: 3,
        date: "2022-12-26",
        quantity: 6130,
        price: 220,
      },
      {
        artistId: 5,
        venueId: 2,
        date: "2022-12-27",
        quantity: 6130,
        price: 221,
      },
      {
        artistId: 6,
        venueId: 2,
        date: "2022-01-02",
        quantity: 633,
        price: 25,
      },
      {
        artistId: 7,
        venueId: 2,
        date: "2022-01-03",
        quantity: 6343,
        price: 253,
      },
      {
        artistId: 8,
        venueId: 3,
        date: "2022-11-30",
        quantity: 632,
        price: 26,
      },
      {
        artistId: 9,
        venueId: 3,
        date: "2022-11-30",
        quantity: 632,
        price: 261,
      },
      {
        artistId: 10,
        venueId: 3,
        date: "2022-11-30",
        quantity: 632,
        price: 261,
      },
      {
        artistId: 11,
        venueId: 3,
        date: "2022-11-30",
        quantity: 632,
        price: 261,
      },
      {
        artistId: 12,
        venueId: 1,
        date: "2022-11-30",
        quantity: 632,
        price: 261,
      },
      {
        artistId: 13,
        venueId: 3,
        date: "2022-12-09",
        quantity: 632,
        price: 261,
      },
      {
        artistId: 14,
        venueId: 1,
        date: "2022-12-09",
        quantity: 632,
        price: 261,
      },
      {
        artistId: 15,
        venueId: 3,
        date: "2022-12-09",
        quantity: 6322,
        price: 2621,
      },
      {
        artistId: 16,
        venueId: 1,
        date: "2022-12-08",
        quantity: 400,
        price: 8000,
      },
      {
        artistId: 17,
        venueId: 3,
        date: "2022-12-12",
        quantity: 400,
        price: 800,
      },
      {
        artistId: 18,
        venueId: 1,
        date: "2022-12-25",
        quantity: 400,
        price: 690,
      },
      {
        artistId: 19,
        venueId: 2,
        date: "2022-12-25",
        quantity: 400,
        price: 690,
      },
      {
        artistId: 20,
        venueId: 2,
        date: "2022-12-25",
        quantity: 400,
        price: 6920,
      },
      {
        artistId: 21,
        venueId: 2,
        date: "2022-12-25",
        quantity: 400,
        price: 6920,
      },
      {
        artistId: 22,
        venueId: 2,
        date: "2022-12-20",
        quantity: 3020,
        price: 34000,
      },
      {
        artistId: 23,
        venueId: 3,
        date: "2022-12-20",
        quantity: 30220,
        price: 1000,
      },
    ];

    const tickets = await Promise.all(ticketsToCreate.map(createTicket));

    console.log("tickets Created:");
    console.log(tickets);
    console.log("Finished creating tickets!");
  } catch (error) {
    console.error("Error creating tickets!");
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

// create initial order data
async function createInitialTicketOrders() {
  try {
    console.log("Starting to create ticket_orders...");

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
      ticketOrdersToCreate.map(createTicketOrder)
    );

    console.log("Ticket Orders created:");
    console.log(ticketOrders);
    console.log("Finished creating Ticket orders");
  } catch (error) {
    console.error("Could not build Ticket orders");
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
    await createInitialTicketOrders();
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
