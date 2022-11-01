const express = require("express");
const bookRouter = require("./books");
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.send("api router working");
});

apiRouter.use("/books", bookRouter);

module.exports = apiRouter;
