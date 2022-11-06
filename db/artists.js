const { response } = require("express");
const client = require(".");
const { getTicketsByArtist } = require("./tickets");

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

async function deleteArtist(artistId) {
  try {
    const ticketsForArtist = await getTicketsByArtist(artistId);
    console.log("ticketsForArtist", ticketsForArtist);
    for (let ticket of ticketsForArtist) {
      console.log("TRYING TO DELETE TICKET ID: ", ticket.id);
      await client.query(
        `
        DELETE
        FROM tickets_orders
        WHERE "ticketId"=$1;
      `,
        [ticket.id]
      );
    }

    console.log("DELETING FROM TICKETS artistId: ", artistId);
    await client.query(
      `
      DELETE
      FROM tickets
      WHERE "artistId"=$1;
    `,
      [artistId]
    );

    const {
      rows: [artist],
    } = await client.query(
      `
    DELETE FROM artists
    WHERE id=$1
    RETURNING *;
  `,
      [artistId]
    );
    return artist;
  } catch (error) {
    console.error("Error in deleteArtist");
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

  const deletedArtist = await deleteArtist(2);
  console.log("deleted artist id 2: ", deletedArtist);
}

// testArtists();

module.exports = {
  createArtists,
  updateArtist,
  deleteArtist,
};
