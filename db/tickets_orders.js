const { response } = require("express");
const client = require(".");

async function createTicketOrder({ orderId, ticketId, quantity }) {
  try {
    const result = await client.query(
      `
    INSERT INTO tickets_orders ("orderId", "ticketId", quantity) 
    VALUES($1, $2, $3)
    RETURNING *;
    `,
      [orderId, ticketId, quantity]
    );
    // console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTicketOrder,
};
