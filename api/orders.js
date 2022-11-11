const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getAllOrders, getOrderById } = require("../db/order");
const { requireUser, requireAdmin } = require("./utils");
const ordersRouter = express.Router();

ordersRouter.get("/", requireUser, requireAdmin, async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.send(orders);
    return;
  } catch (error) {
    next(error);
    return;
  }
});

ordersRouter.get(
  "/:orderId",
  requireUser,
  requireAdmin,
  async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
      // check to see if order id exists
      const order = await getOrderById(orderId);
      if (!order) {
        const err = new Error(`Order ${orderId} not found`);
        err.status = 400;
        err.name = "NonExistingOrderError";
        next(err);
      }
      res.send(order);
    } catch (error) {
      next(error);
    }
  }
);
