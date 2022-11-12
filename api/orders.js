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
  const user = req.user;
  try {
    // check to see if order id exists
    const order = await getOrderById(orderId);
    if (!order) {
      const err = new Error(`Order ${orderId} not found`);
      err.status = 400;
      err.name = "NonExistingOrderError";
      next(err);
    }
    // user must either be admin or have a matching userId to view this order
    if (user.admin || user.id === order.userId) {
      res.send(order);
    } else {
      const err = new Error(
        `User Id ${user.id} does not have access to view this order`
      );
      err.status = 400;
      err.name = "UnauthorizedUserError";
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/orders/:orderId
ordersRouter.patch("/:orderId", requireAdmin, async (req, res, next) => {
  const orderId = req.params.orderId;
  const inputFields = req.body;
  try {
    // check to see if the order exists and update if it does
    const checkOrderId = await getOrderById(orderId);
    if (!checkOrderId) {
      const err = new Error(`order ${orderId} not found`);
      err.status = 400;
      err.name = "NotexistingOrderId";
      next(err);
      return;
    }
    // update the Order
    inputFields.id = orderId;
    const updatedOrder = await updateOrder(inputFields);
    res.send(updatedOrder);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = ordersRouter;
