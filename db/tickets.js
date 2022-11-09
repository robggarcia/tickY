const { response } = require("express");
const client = require(".");

async function createTicket({
  artistId,
  venueId,
  date,
  price,
  quantity,
  seatTier,
}) {
  try {
    const result = await client.query(
      `
    INSERT INTO tickets ("artistId", "venueId", date, price, quantity, "seatTier") 
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `,
      [artistId, venueId, date, price, quantity, seatTier]
    );
    // console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function attachArtistAndVenueToTicket(ticket) {
  const {
    rows: [artist],
  } = await client.query(
    `
    SELECT *
    FROM artists
    WHERE id=$1;
  `,
    [ticket.artistId]
  );
  const {
    rows: [venue],
  } = await client.query(
    `
    SELECT *
    FROM venues
    WHERE id=$1;
  `,
    [ticket.venueId]
  );

  ticket.artist = artist;
  ticket.venue = venue;
  return ticket;
}

async function getAllTickets() {
  try {
    /* const { rows: tickets } = await client.query(`
      SELECT tickets.*, venues.name AS venue, artists.name AS artist, artists.image AS image
      FROM tickets
      JOIN venues ON "venueId"=venues.id
      JOIN artists ON "artistId"=artists.id;
    `); */
    const { rows: tickets } = await client.query(`
      SELECT *
      FROM tickets;
    `);
    for (let ticket of tickets) {
      ticket = await attachArtistAndVenueToTicket(ticket);
    }
    return tickets;
  } catch (error) {
    console.error("Error in getAllTickets");
    throw error;
  }
}

async function getTicketById(id) {
  try {
    const {
      rows: [ticket],
    } = await client.query(
      `
      SELECT *
      FROM tickets
      WHERE id = $1;
    `,
      [id]
    );
    return ticket;
  } catch (error) {
    console.error("Error in getTicketById");
    throw error;
  }
}

async function updateTicket({ id, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((key, idx) => `"${key}"=$${idx + 2}`)
      .join(", ");
    const {
      rows: [ticket],
    } = await client.query(
      `
          UPDATE tickets
          SET ${setString}
          WHERE id=$1
          RETURNING *;
      `,
      [id, ...Object.values(fields)]
    );
    return ticket;
  } catch (error) {
    console.log("Error in updateTicket");
    throw error;
  }
}

async function deleteTicket(id) {
  try {
    await client.query(
      `
      DELETE
      FROM tickets_orders
      WHERE "ticketId"=$1;
    `,
      [id]
    );
    const {
      rows: [ticket],
    } = await client.query(
      `
    DELETE FROM tickets
    WHERE id=$1
    RETURNING *;
  `,
      [id]
    );
    return ticket;
  } catch (error) {
    console.error("Error in deleteTicket");
    throw error;
  }
}

async function getAllUnsoldTickets() {
  try {
    const tickets = await getAllTickets();
    const unsoldTickets = tickets.filter((ticket) => ticket.quantity > 0);
    return unsoldTickets;
  } catch (error) {
    console.error("Error in getAllUnsoldTickets");
    throw error;
  }
}

async function getTicketsByArtist(artistId) {
  try {
    const allTickets = await getAllTickets();
    const ticketsByArtist = allTickets.filter((ticket) => {
      if (ticket.artistId === artistId) return true;
      return false;
    });

    return ticketsByArtist;
  } catch (error) {
    console.error("Error in getArtistTickets");
    throw error;
  }
}

async function getTicketsByVenue(venueId) {
  try {
    const allTickets = await getAllTickets();
    const ticketsByVenue = allTickets.filter((ticket) => {
      if (ticket.venueId === venueId) return true;
      return false;
    });

    return ticketsByVenue;
  } catch (error) {
    console.error("Error in getVenueTickets");
    throw error;
  }
}

module.exports = {
  createTicket,
  getAllTickets,
  getAllUnsoldTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByArtist,
  getTicketsByVenue,
};
