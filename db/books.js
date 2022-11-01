const { response } = require("express");
const client = require(".");

const fetchBooks = async () => {
  const response = await client.query(`
        SELECT * FROM books
    `);
  return response.rows;
};

module.exports = fetchBooks;
