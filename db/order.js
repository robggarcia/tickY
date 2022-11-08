const { response } = require("express");
const client = require(".");

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

async function getAllOrders() {}

async function getOrderById(id) {}

async function updateOrder({ id, purchased }) {}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
};
