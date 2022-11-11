const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getAllArtists, getArtistById } = require("../db/artists");
const { getTicketOrderById } = require("../db/tickets_orders");
const { ArtistExistsError } = require("../errors");
const { requireUser } = require("./utils");
const ticketsOrdersRouter = express.Router();

// GET api/tickets_orders/:/ticketOrderId
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

module.exports = ticketsOrdersRouter;
