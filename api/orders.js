const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const {
  getAllOrders,
  getOrderById,
  updateOrder,
  createOrder,
} = require("../db/order");
const { requireUser, requireAdmin } = require("./utils");
const ordersRouter = express.Router();

// POST /api/orders
ordersRouter.post("/", requireUser, async (req, res, next) => {
  const inputFields = req.body;
  if (!inputFields.purchased) inputFields.purchased = false;
  if (!inputFields.userId) inputFields.userId = req.user.id;
  try {
    // create the new order
    const order = await createOrder(inputFields);
    res.send(order);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/orders
ordersRouter.get("/", requireAdmin, async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.send(orders);
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// GET /api/orders/:orderId
ordersRouter.get("/:orderId", requireUser, async (req, res, next) => {
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
});

// PATCH /api/orders/:orderId
ordersRouter.patch("/:orderId", requireUser, async (req, res, next) => {
  const orderId = req.params.orderId;
  const inputFields = req.body;
  try {
    // check to see if order id exists
    const order = await getOrderById(orderId);
    if (!order) {
      const err = new Error(`Order ${orderId} not found`);
      err.status = 400;
      err.name = "NonExistingOrderError";
      next(err);
    }
    // update the order
    inputFields.id = orderId;
    const updatedOrder = await updateOrder(inputFields);
    res.send(updatedOrder);
  } catch (error) {
    next(error);
  }
});
module.exports = ordersRouter;
