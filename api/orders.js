const express = require("express");
const { createOrder } = require("../db/order");
const { requireUser } = require("./utils");
const ordersRouter = express.Router;

ordersRouter.post("/", requireUser, async (req, res, next) => {
  const inputFields = req.body;
  try {
    const order = await createOrder(inputFields);
    res.send(order);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
