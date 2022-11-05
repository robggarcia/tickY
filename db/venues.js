const client = require(".");

async function createVenue({ name, city, state, capacity }) {
  try {
    const {
      rows: [venue],
    } = await client.query(
      `
        INSERT INTO venues(name, city, state, capacity)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `,
      [name, city, state, capacity]
    );
    return venue;
  } catch (error) {
    console.error("Error during createVenue");
    throw error;
  }
}

module.exports = { createVenue };
