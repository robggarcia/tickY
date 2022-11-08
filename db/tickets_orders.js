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

async function getTicketOrderById(id) {}

async function addTicketToOrder({ orderId, ticketId, quantity }) {}

async function editTicketOrder({ id, quantity }) {}

async function deleteTicketOrder(id) {}

module.exports = {
  createTicketOrder,
  getTicketOrderById,
  addTicketToOrder,
  editTicketOrder,
  deleteTicketOrder,
};
