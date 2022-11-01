const express = require("express");
const bookRouter = express.Router();

bookRouter.get("/", (req, res) => {
  res.send("book router working");
});

module.exports = bookRouter;
