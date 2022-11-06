const { response } = require("express");
const client = require(".");

async function createTickets({
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

async function getAllTickets() {
  try {
    const { rows } = await client.query(`
      SELECT tickets.*, venues.name AS venue, artists.name AS artist, artists.image AS image
      FROM tickets
      JOIN venues ON "venueId"=venues.id
      JOIN artists ON "artistId"=artists.id;
    `);
    return rows;
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
    const unsoldTickets = await getAllUnsoldTickets();
    const ticketsByArtist = unsoldTickets.filter((ticket) => {
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
    const unsoldTickets = await getAllUnsoldTickets();
    const ticketsByVenue = unsoldTickets.filter((ticket) => {
      if (ticket.venueId === venueId) return true;
      return false;
    });

    return ticketsByVenue;
  } catch (error) {
    console.error("Error in getVenueTickets");
    throw error;
  }
}

// testing adapter functions
async function testTickets() {
  // const tickets = await getAllTickets();
  // console.log("all tickets: ", tickets);

  // const ticket = await getTicketById(2);
  // console.log("get ticket id=2: ", ticket);

  // const editedTicket = await updateTicket({ id: 2, price: 200, quantity: 550 });
  // console.log("Updated ticket: ", editedTicket);

  // const deletedTicket = await deleteTicket(2);
  // console.log("Deleted ticket: ", deletedTicket);

  const artistTicket = await getTicketsByArtist(2);
  console.log("Ticket by Artist id = 2: ", artistTicket);

  const venueTicket = await getTicketsByVenue(1);
  console.log("Ticket by Venue id = 1: ", venueTicket);
}

testTickets();

module.exports = {
  createTickets,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByArtist,
  getTicketsByVenue,
};
