const express = require("express");
const usersRouter = require("./users");
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.send("api router working");
});

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
