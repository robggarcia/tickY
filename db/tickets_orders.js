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

async function editTicketOrder({ id, quantity }) {
  try {
    const {
      rows: [ticket],
    } = await client.query(
      `
          UPDATE tickets
          SET quantity=$2
          WHERE id=$1
          RETURNING *;
      `,
      [id, quantity]
    );
    return ticket;
  } catch (error) {
    console.log("Error in editTicketOrder");
    throw error;
  }
}

async function deleteTicketOrder(id) {}

module.exports = {
  createTicketOrder,
  getTicketOrderById,
  addTicketToOrder,
  editTicketOrder,
  deleteTicketOrder,
};
