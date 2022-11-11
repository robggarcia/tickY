const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getTicketsByVenue } = require("../db/tickets");
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

venuesRouter.get("/:venueId/tickets", async (req, res, next) => {
  try {
    const venueId = req.params.venueId;
    console.log(venueId);
    const tickets = await getTicketsByVenue(+venueId);
    console.log(tickets);
    res.send(tickets);
  } catch (error) {
    next(error);
  }
});

console.log("test");

module.exports = venuesRouter;
