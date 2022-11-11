const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getAllArtists, getArtistById } = require("../db/artists");
const { getTicketOrderById } = require("../db/tickets_orders");
const { ArtistExistsError } = require("../errors");
const { requireUser } = require("./utils");
const ticketsOrdersRouter = express.Router();

// GET api/tickets_orders/:ticketOrderId
ticketsOrdersRouter.get(
  "/:ticketOrderId",
  requireUser,
  async (req, res, next) => {
    const ticketOrderId = req.params.ticketOrderId;
    try {
      const ticketOrder = await getTicketOrderById(+ticketOrderId);
      if (!ticketOrder) {
        const err = new Error(
          `Ticket Order id ${ticketOrderId} does not exist`
        );
        err.status = 400;
        err.name = "NonExistingTicketOrderError";
        next(err);
        return;
      }
      res.send(ticketOrder);
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// PATCH api/tickets_orders/:ticketOrderId
ticketsOrdersRouter.patch(
  "/:ticketOrderId",
  requireUser,
  async (req, res, next) => {
    const ticketOrderId = req.params.ticketOrderId;
    const inputFields = req.body;
    try {
      // check to see if the artist exists and update if it does
      const ticketOrder = await getTicketOrderById(+ticketOrderId);
      if (!ticketOrder) {
        const err = new Error(
          `Ticket Order id ${ticketOrderId} does not exist`
        );
        err.status = 400;
        err.name = "NonExistingTicketOrderError";
        next(err);
        return;
      }
      inputFields.id = ticketOrderId;
      const updatedTicketOrder = await updatedTicketOrder(inputFields);
      res.send(updatedTicketOrder);
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// DELETE api/tickets_orders/:ticketOrderId
ticketsOrdersRouter.delete(
  "/:ticketOrderId",
  requireUser,
  async (req, res, next) => {
    const ticketOrderId = req.params.ticketOrderId;
    try {
      // check to see if the artist exists and update if it does
      const ticketOrder = await getTicketOrderById(+ticketOrderId);
      if (!ticketOrder) {
        const err = new Error(
          `Ticket Order id ${ticketOrderId} does not exist`
        );
        err.status = 400;
        err.name = "NonExistingTicketOrderError";
        next(err);
        return;
      }
      // delete the ticket order
      const deletedTicketOrder = await deletedTicketOrder(+ticketOrderId);
      res.send(deletedTicketOrder);
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

module.exports = ticketsOrdersRouter;
