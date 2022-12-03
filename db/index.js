require("dotenv").config();
const { Pool } = require("pg");

const client = new Pool(
  process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "grace-starter",
      }
);

module.exports = client;
