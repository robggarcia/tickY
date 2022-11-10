const { response } = require("express");
const client = require(".");

async function createTicketOrder({ orderId, ticketId, quantity }) {
  try {
    const {
      rows: [ticketOrder],
    } = await client.query(
      `
    INSERT INTO tickets_orders ("orderId", "ticketId", quantity) 
    VALUES($1, $2, $3)
    RETURNING *;
    `,
      [orderId, ticketId, quantity]
    );
    return ticketOrder;
  } catch (error) {
    throw error;
  }
}

async function getTicketOrderById(id) {
  try {
    const {
      rows: [ticketOrder],
    } = await client.query(
      `
    SELECT * FROM tickets_orders
    WHERE id =$1;`,
      [id]
    );
    return ticketOrder;
  } catch (error) {
    throw error;
  }
}

async function editTicketOrder({ id, quantity }) {
  try {
    const {
      rows: [ticketOrder],
    } = await client.query(
      `
          UPDATE tickets_orders
          SET quantity=$2
          WHERE id=$1
          RETURNING *;
      `,
      [id, quantity]
    );
    return ticketOrder;
  } catch (error) {
    console.log("Error in editTicketOrder");
    throw error;
  }
}

async function deleteTicketOrder(id) {
  try {
    const {
      rows: [deletedTicketOrder],
    } = await client.query(
      `
    DELETE FROM tickets_orders 
    WHERE id=$1
    RETURNING *;
    `,
      [id]
    );
    return deletedTicketOrder;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTicketOrder,
  getTicketOrderById,
  editTicketOrder,
  deleteTicketOrder,
};
