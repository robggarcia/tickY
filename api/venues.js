const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getVenues } = require("../db/venues");
const venuesRouter = express.Router();

// GET /api/venues
venuesRouter.get("/", async (req, res, next) => {
  try {
    const venues = await getVenues();
    res.send(venues);
  } catch (error) {
    next(error);
  }
});

module.exports = venuesRouter;
