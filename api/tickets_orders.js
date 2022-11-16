const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getAllArtists, getArtistById } = require("../db/artists");
const { getOrderById } = require("../db/order");
const {
  getTicketOrderById,
  createTicketOrder,
  editTicketOrder,
  deleteTicketOrder,
} = require("../db/tickets_orders");
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

// POST api/tickets_orders
ticketsOrdersRouter.post("/", requireUser, async (req, res, next) => {
  const inputFields = req.body;
  try {
    // confirm user specified what ticket to purchase
    if (!inputFields.ticketId || !inputFields.orderId) {
      const err = new Error(
        `Insufficient input paramters provided to create ticket order`
      );
      err.status = 400;
      err.name = "MoreInfoRequiredError";
      next(err);
      return;
    }
    // confirm orderId exists
    const order = await getOrderById(inputFields.orderId);
    if (!order) {
      const err = new Error(`Order Id ${inputFields.orderId} does not exist`);
      err.status = 400;
      err.name = "NoOrderExistsError";
      next(err);
      return;
    }

    const ticketOrder = await createTicketOrder(inputFields);
    if (!ticketOrder) {
      const err = new Error(`Unable to create ticket order`);
      err.status = 400;
      err.name = "NonExistingTicketOrderError";
      next(err);
      return;
    }
    res.send(ticketOrder);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

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
      const updatedTicketOrder = await editTicketOrder(inputFields);
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
    const user = req.user;
    try {
      // check to see if the ticketOrder exists and delete if it does
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
      // confirm userId matches order.userId
      const order = await getOrderById(ticketOrder.orderId);
      if (user.id !== order.userId) {
        const err = new Error(
          `User id ${user.id} does not have access to delete this ticket_order`
        );
        err.status = 400;
        err.name = "UnauthorizedUserError";
        next(err);
        return;
      }
      // delete the ticket order
      const deletedTicketOrder = await deleteTicketOrder(+ticketOrderId);
      res.send(deletedTicketOrder);
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

module.exports = ticketsOrdersRouter;
