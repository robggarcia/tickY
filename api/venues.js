const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getVenues } = require("../db/venues");
const venuesRouter = express.Router();

venuesRouter.get("/", async (req, res, next) => {
  try {
    const venues = await getVenues();
    res.send(venues);
    return;
  } catch (error) {
    next(error);
    return;
  }
});

module.exports = venuesRouter;
