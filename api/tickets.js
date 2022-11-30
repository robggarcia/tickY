const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const {
  getAllTickets,
  getAllUnsoldTickets,
  getTicketById,
  getTicketsByArtist,
  createTicket,
  updateTicket,
} = require("../db/tickets");
const { requireUser, requireAdmin } = require("./utils");
const ticketsRouter = express.Router();

// GET /api/tickets
ticketsRouter.get("/", async (req, res, next) => {
  try {
    const tickets = await getAllUnsoldTickets();
    res.send(tickets);
    return;
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/tickets/:ticketId
ticketsRouter.get("/:ticketId", async (req, res, next) => {
  const ticketId = req.params.ticketId;
  try {
    // check to see if ticket id exists
    const ticket = await getTicketById(ticketId);
    if (!ticket) {
      const err = new Error(`Ticket ${ticketId} not found`);
      err.status = 400;
      err.name = "TicketNotFoundError";
      next(err);
    }
    res.send(ticket);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/tickets
ticketsRouter.post("/", requireAdmin, async (req, res, next) => {
  const inputFields = req.body;
  try {
    // check to see if the ticket already exists (check artist and venue)
    const existingTickets = await getTicketsByArtist(inputFields.artistId);
    if (existingTickets) {
      for (let ticket of existingTickets) {
        if (ticket.venueId === req.body.venueId) {
          const date = new Date(req.body.date);
          if (ticket.date.toString() == date) {
            const err = new Error(
              `A ticket with artist and venue on date ${req.body.date} already exists`
            );
            err.status = 400;
            err.name = "ExistingTicketError";
            next(err);
            return;
          }
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

// PATCH /api/tickets/:ticketId
ticketsRouter.patch("/:ticketId", requireUser, async (req, res, next) => {
  const ticketId = req.params.ticketId;
  const inputFields = req.body;
  try {
    // check to see if the artist and venue on the ticket already exist
    const existingTickets = await getTicketsByArtist(inputFields.artistId);
    if (existingTickets) {
      for (let ticket of existingTickets) {
        if (ticket.venueId === req.body.venueId) {
          const err = new Error(
            `An ticket with name ${inputFields.name} already exists`
          );
          err.status = 400;
          err.name = "ExistingTicketError";
          next(err);
          return;
        }
      }
    }
    // check to see if the ticket exists and update it
    const checkTicketId = await getTicketById(ticketId);
    if (!checkTicketId) {
      const err = new Error(`Ticket ${ticketId} not found`);
      err.status = 400;
      err.name = "NonExistingTicketError";
      next(err);
      return;
    }
    // update the ticket
    inputFields.id = ticketId;
    const updatedTicket = await updateTicket(inputFields);
    res.send(updatedTicket);
  } catch ({ name, message }) {
    next({ error, message });
  }
});

// DELETE /api/tickets/:ticketId
ticketsRouter.delete("/:ticketId", requireAdmin, async (req, res, next) => {
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
    // delete ticket
    const deletedTicket = await deleteTicket(ticketId);
    res.send(deletedTicket);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = ticketsRouter;
