require("dotenv").config();
const { Pool } = require("pg");

const client = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATBASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "grace-starter",
      }
);

module.exports = client;
