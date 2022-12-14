const { response } = require("express");
const client = require(".");
const { getTicketById } = require("./tickets");

async function createOrder({ userId, purchased }) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
    INSERT INTO orders ("userId", purchased) 
    VALUES ($1, $2)
    RETURNING *;
    `,
      [userId, purchased]
    );

    return order;
  } catch (error) {
    throw error;
  }
}

async function getAllOrders() {
  try {
    const { rows: orders } = await client.query(`
      SELECT * 
      FROM orders;
    `);

    for (let order of orders) {
      if (!order) return null;
      // attach ticket to order by first grabbing the ticket_order
      const { rows: ticket_orders } = await client.query(
        `
      SELECT *
      FROM tickets_orders
      WHERE "orderId"=$1;
    `,
        [order.id]
      );
      order.ticketOrders = ticket_orders;
      const tickets = [];
      for (let ticket_order of ticket_orders) {
        console.log("ticket_order.ticketId", ticket_order.ticketId);
        const ticket = await getTicketById(ticket_order.ticketId);
        ticket.quantity = ticket_order.quantity;
        tickets.push(ticket);
      }
      order.tickets = tickets;
    }

    return orders;
  } catch (error) {
    console.error("Error in getAllOrders");
    throw error;
  }
}

async function getOrderById(id) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
      SELECT *
      FROM orders
      WHERE id = $1;
    `,
      [id]
    );
    if (!order) return null;
    // attach ticket to order by first grabbing the ticket_order
    const { rows: ticket_orders } = await client.query(
      `
      SELECT *
      FROM tickets_orders
      WHERE "orderId"=$1;
    `,
      [order.id]
    );
    order.ticketOrders = ticket_orders;
    const tickets = [];
    for (let ticket_order of ticket_orders) {
      console.log("ticket_order.ticketId", ticket_order.ticketId);
      const ticket = await getTicketById(ticket_order.ticketId);
      ticket.quantity = ticket_order.quantity;
      tickets.push(ticket);
    }
    order.tickets = tickets;
    return order;
  } catch (error) {
    console.error("Error in getOrderById");
    throw error;
  }
}

async function updateOrder({ id, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((key, idx) => `"${key}"=$${idx + 2}`)
      .join(", ");
    const {
      rows: [order],
    } = await client.query(
      `
          UPDATE orders
          SET ${setString}
          WHERE id=$1
          RETURNING *;
      `,
      [id, ...Object.values(fields)]
    );
    return order;
  } catch (error) {
    console.log("Error in updateOrder");
    throw error;
  }
}

async function getOrdersByUserId(userId) {
  try {
    const { rows: orders } = await client.query(
      `
      SELECT *
      FROM orders
      WHERE "userId"=$1;
    `,
      [userId]
    );
    // attach tickets to each order
    const fullOrders = [];
    for (let order of orders) {
      const fullOrder = await getOrderById(order.id);
      fullOrders.push(fullOrder);
    }
    return fullOrders;
  } catch (error) {
    console.log("error in getOrdersByUserId");
    throw error;
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  getOrdersByUserId,
};
