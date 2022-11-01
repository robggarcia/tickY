const client = require(".");

const seedDB = async () => {
  // before we insert a book what do we need to build?
  // we need a book table
  await client.query(`
        DROP TABLE IF EXISTS books;
  
        CREATE TABLE books(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL
        );

        INSERT INTO books (title)
        VALUES ('Moby Dick');
    `);
  console.log("DB seeded");
};

seedDB();
