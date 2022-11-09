const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getAllTickets } = require("../db/tickets");
const ticketsRouter = express.Router();

ticketsRouter.get("/", async (req, res, next) => {
  try {
    const tickets = await getAllTickets();
    res.send(tickets);
    return;
  } catch (error) {
    next(error);
    return;
  }
});
