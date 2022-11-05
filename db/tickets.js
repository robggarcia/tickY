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
      SELECT tickets.*, venues.name AS venue, artists.name AS artist
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

// testing adapter functions
async function testTickets() {
  const tickets = await getAllTickets();
  console.log(tickets);
}

testTickets();

module.exports = {
  createTickets,
  getAllTickets,
};
