const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const {
  getAllTickets,
  getAllUnsoldTickets,
  getTicketById,
} = require("../db/tickets");
const ticketsRouter = express.Router();

ticketsRouter.get("/", async (req, res, next) => {
  try {
    const tickets = await getAllUnsoldTickets();
    res.send(tickets);
    return;
  } catch ({ name, message }) {
    next({ name, message });
  }
});

ticketsRouter.get("/:ticketId", async (req, res, next) => {
  const ticketId = req.params.ticketId;
  try {
    // check to see if ticket id exists
    const ticket = await getTicketById(ticketId);
    if (!ticket) {
      const err = new Error(`Ticket ${ticketId} not found`);
      err.status = 400;
      err.name = "NonExistingTicketError";
      next(err);
    }
    res.send(ticket);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
