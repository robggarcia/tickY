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

module.exports = {
  createOrder,
};
