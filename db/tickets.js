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

module.exports = {
  createTickets,
};
