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
    // console.log(venues);
    return venues;
  } catch (error) {
    console.error("Error in getVenues");
    throw error;
  }
}

async function updateVenue({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // console.log(setString);
  if (setString.length > 0) {
    const update = await client.query(
      `
      UPDATE venues
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );
    return update.rows[0];
  }
}

async function destroyVenue(id) {
  const result = await client.query(
    `
  DELETE FROM venues
  WHERE id=$1
  RETURNING *;`,
    [id]
  );
  return result.rows[0];
}

async function getVenueById(id) {
  try {
    const { rows: venues } = await client.query(
      `
    SELECT * FROM venues 
    WHERE id=$1;`,
      [id]
    );
    console.log(venues);
    return venues;
  } catch (error) {}
}

// testing adapter functions
async function testVenues() {
  const venues = await getVenueById(1);
  console.log("all venues: ", venues);
}

// testVenues();

module.exports = {
  createVenue,
  getVenues,
  updateVenue,
  destroyVenue,
  getVenueById,
};
