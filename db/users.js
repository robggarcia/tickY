const { response } = require("express");
const client = require(".");
const bcrypt = require("bcrypt");

const getAllUsers = async () => {
  const response = await client.query(`
        SELECT * FROM users
    `);
  return response.rows;
};

async function createUser({ username, password, email, admin }) {
  // hash password before inserting it into database
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users (username, password, email, admin) 
    VALUES($1, $2, $3, $4)
    ON CONFLICT (username) DO NOTHING 
    RETURNING id, username, email, admin;
    `,
      [username, hashedPassword, email, admin]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    // retrieve the user from the database from the given username
    const user = await getUserByUsername(username);

    // confirm correct password
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      delete user.password;
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error in getUser");
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE id=$1;
    `,
      [userId]
    );
    if (!user) return null;
    delete user.password;
    return user;
  } catch (error) {
    console.log("Error in getUserById");
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT *
        FROM users
        WHERE username=$1;
    `,
      [userName]
    );

    if (!user) return null;

    return user;
  } catch (error) {
    console.log("Error in getUserByUsername");
    throw error;
  }
}

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
