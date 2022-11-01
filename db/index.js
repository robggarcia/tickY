const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL || "https://localhost:5432/fitness-dev";

const client = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString,
        ssl:
          process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : undefined,
      }
    : {
        username: process.env.DB_PASSWORD,
        password: "postgres",
        database: "grace-starter",
      }
);

module.exports = client;
