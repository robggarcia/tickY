const express = require("express");
const fetchUsers = require("../db/users");
const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  // to get books we need a database adapter function called fetchBooks;
  const users = await fetchUsers();
  res.send({ success: true, users });
});

module.exports = usersRouter;
