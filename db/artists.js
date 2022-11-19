const client = require(".");
const { getTicketsByArtist } = require("./tickets");

async function createArtist({ name, genre, image, description }) {
  try {
    const {
      rows: [artist],
    } = await client.query(
      `
    INSERT INTO artists (name, genre, image, description) 
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `,
      [name, genre, image, description]
    );
    return artist;
  } catch (error) {
    throw error;
  }
}

async function getAllArtists() {
  try {
    const { rows: artists } = await client.query(`
      SELECT * 
      FROM artists;
    `);
    return artists;
  } catch (error) {
    console.error("Error in getArtist");
    throw error;
  }
}

async function updateArtist({ id, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((key, idx) => `"${key}"=$${idx + 2}`)
      .join(", ");
    const {
      rows: [updatedTicket],
    } = await client.query(
      `
          UPDATE artists
          SET ${setString}
          WHERE id=$1
          RETURNING *;
      `,
      [id, ...Object.values(fields)]
    );
    return updatedTicket;
  } catch (error) {
    console.log("Error in updateArtist");
    throw error;
  }
}

async function deleteArtist(artistId) {
  try {
    const ticketsForArtist = await getTicketsByArtist(artistId);
    for (let ticket of ticketsForArtist) {
      await client.query(
        `
        DELETE
        FROM tickets_orders
        WHERE "ticketId"=$1;
      `,
        [ticket.id]
      );
    }

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

async function getArtistById(id) {
  const {
    rows: [artist],
  } = await client.query(
    `
  SELECT * FROM artists 
  WHERE id=$1;`,
    [id]
  );
  return artist;
}

async function getArtistByName(artistName) {
  const {
    rows: [artist],
  } = await client.query(
    `
  SELECT * FROM artists 
  WHERE name=$1;`,
    [artistName]
  );
  return artist;
}

module.exports = {
  getAllArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  getArtistById,
  getArtistByName,
};
