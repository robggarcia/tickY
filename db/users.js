const { response } = require("express");
const client = require(".");

const fetchUsers = async () => {
  const response = await client.query(`
        SELECT * FROM users
    `);
  return response.rows;
};

async function createUser({ username, password, email, admin }) {
  try {
    const result = await client.query(
      `
    INSERT INTO users (username, password, email, admin) 
    VALUES($1, $2, $3, $4)
    ON CONFLICT (username) DO NOTHING 
    RETURNING id, username, email, admin;
    `,
      [username, password, email, admin]
    );
    // console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  fetchUsers,
};
