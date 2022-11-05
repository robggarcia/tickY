const { response } = require("express");
const client = require(".");

const fetchUsers = async () => {
  const response = await client.query(`
        SELECT * FROM users
    `);
  return response.rows;
};

async function createUser({ username, password, email }) {
  try {
    const result = await client.query(
      `
    INSERT INTO users (username, password, email) 
    VALUES($1, $2, $3)
    ON CONFLICT (username) DO NOTHING 
    RETURNING id, username, email;
    `,
      [username, password, email]
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
