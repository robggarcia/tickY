const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getAllOrders, getOrderById, updateOrder } = require("../db/order");
const { requireUser, requireAdmin } = require("./utils");
const ordersRouter = express.Router();

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

ordersRouter.get("/:orderId", requireAdmin, async (req, res, next) => {
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
    const updateOrder = await updateOrder(inputFields);
    res.send(updateOrder);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = ordersRouter;
