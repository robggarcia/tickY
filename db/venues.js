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

async function getVenues() {
  try {
    const { rows: venues } = await client.query(`
        SELECT * 
        FROM venues;
      `);
    return venues;
  } catch (error) {
    console.error("Error in getVenues");
    throw error;
  }
}

// testing adapter functions
async function testVenues() {
  const venues = await getVenues();
  console.log("all venues: ", venues);
}

testVenues();

module.exports = { createVenue, getVenues };
