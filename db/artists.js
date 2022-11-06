const { response } = require("express");
const client = require(".");

async function createArtists({ name, genre, image, description }) {
  try {
    const result = await client.query(
      `
    INSERT INTO artists (name, genre, image, description) 
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `,
      [name, genre, image, description]
    );
    // console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function getArtists() {
  try {
    const { rows: artists } = await client.query(`
      SELECT * 
      FROM artists;
    `);
    return artists;
  } catch (error) {
    console.error("Error in getArtists");
    throw error;
  }
}

async function updateArtist({ id, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((key, idx) => `"${key}"=$${idx + 2}`)
      .join(", ");
    const {
      rows: [ticket],
    } = await client.query(
      `
          UPDATE artists
          SET ${setString}
          WHERE id=$1
          RETURNING *;
      `,
      [id, ...Object.values(fields)]
    );
    return ticket;
  } catch (error) {
    console.log("Error in updateArtist");
    throw error;
  }
}

// testing adapter functions
async function testArtists() {
  const artists = await getArtists();
  console.log("all artists: ", artists);

  const editedArtist = await updateArtist({
    id: 2,
    genre: "contemperary",
    description: "a dead white dude",
  });
  console.log("updated artist: ", editedArtist);
}

testArtists();

module.exports = {
  createArtists,
  updateArtist,
};
