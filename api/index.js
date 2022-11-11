const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const apiRouter = express.Router();

// GET /api/health
apiRouter.get("/health", async (req, res) => {
  res.send({
    success: true,
    message: "The server is up and running. It is healthy!",
  });
});

// set 'req.user' if possible
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set: ", req.user);
  }
  next();
});

apiRouter.get("/", (req, res) => {
  res.send("api router working");
});

// ROUTER: /api/users
const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

// ROUTER: /api/artists
const artistsRouter = require("./artists");
apiRouter.use("/artists", artistsRouter);

// ROUTER: /api/venues
const venuesRouter = require("./venues");
apiRouter.use("/venues", venuesRouter);

// ROUTER: /api/tickets
const ticketsRouter = require("./tickets");
apiRouter.use("/tickets", ticketsRouter);

// ROUTER: /api/tickets_orders
const ticketOrdersRouter = require("./tickets_orders");
apiRouter.use("/tickets_orders", ticketOrdersRouter);

// ROUTER: /api/orders
const ordersRouter = require("./orders");
const { getUserById } = require("../db/users");
apiRouter.use("/orders", ordersRouter);

apiRouter.get("*", (req, res) => {
  res.status(404);
  res.send({ success: false, message: "page missing" });
});

// error handler MUST have all 4 parameters or it won't fire!
apiRouter.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: "Something went wrong",
    name: err.name,
    message: err.message,
  });
});

module.exports = apiRouter;
