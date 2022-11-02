const { response } = require("express");
const client = require(".");

const fetchUsers = async () => {
  const response = await client.query(`
        SELECT * FROM users
    `);
  return response.rows;
};

module.exports = fetchUsers;
