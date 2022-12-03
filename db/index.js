require("dotenv").config();
const { Pool } = require("pg");

const client = new Pool(
  process.env.DATABASE_URL
    ? {
        url: process.env.DATBASE_URL,
        database: "grace-starter",
      }
    : {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "grace-starter",
      }
);

/* const client = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATBASE_URL,
        ssl:
          process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : null,
      }
    : {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "grace-starter",
      }
); */

module.exports = client;
