const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const {
  getAllTickets,
  getAllUnsoldTickets,
  getTicketById,
  getTicketsByArtist,
  createTicket,
} = require("../db/tickets");
const { requireUser, requireAdmin } = require("./utils");
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

ticketsRouter.post("/", requireUser, requireAdmin, async (req, res, next) => {
  const inputFields = req.body;
  try {
    // check to see if the ticket already exists (check artist and venue)
    const existingTickets = await getTicketsByArtist(inputFields.artistId);
    if (existingTickets) {
      for (let ticket of existingTickets) {
        if (ticket.venueId === req.body.venueId) {
          const err = new Error(
            `An activity with name ${inputFields.name} already exists`
          );
          err.status = 400;
          err.name = "ExistingActivityError";
          next(err);
          return;
        }
      }
    }

    // create the new ticket
    const ticket = await createTicket(inputFields);
    res.send(ticket);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
