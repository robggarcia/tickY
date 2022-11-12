const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getTicketsByVenue } = require("../db/tickets");
const {
  getVenues,
  createVenue,
  getVenueById,
  updateVenue,
  getVenueByName,
  destroyVenue,
} = require("../db/venues");
const { requireAdmin } = require("./utils");
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

// GET /api/venues/:venueId
venuesRouter.get("/:venueId", async (req, res, next) => {
  try {
    const venueId = req.params.venueId;
    const venue = await getVenueById(+venueId);
    res.send(venue);
  } catch (error) {
    next(error);
  }
});

// GET /api/venues/:venueId/tickets
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

// POST /api/venues/
venuesRouter.post("/", requireAdmin, async (req, res, next) => {
  const inputFields = req.body;
  try {
    // check to see if the venue already exists
    const existingVenue = await getVenueByName(inputFields.name);
    if (existingVenue) {
      const err = new Error(
        `A venue with name ${inputFields.name} already exists`
      );
      err.status = 400;
      err.name = "ExistingVenueError";
      next(err);
      return;
    }
    // create the new ticket
    const venue = await createVenue(inputFields);
    res.send(venue);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/venues/:venueId
venuesRouter.patch("/:venueId", requireAdmin, async (req, res, next) => {
  const venueId = req.params.venueId;
  const inputFields = req.body;
  try {
    // check to see if the venue exists and update if it does
    const checkVenueId = await getVenueById(venueId);
    if (!checkVenueId) {
      const err = new Error(`venue ${venueId} not found`);
      err.status = 400;
      err.name = "NonExistingVenueError";
      next(err);
      return;
    }
    // update the artist
    inputFields.id = venueId;
    const updatedVenue = await updateVenue(inputFields);
    res.send(updatedVenue);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/venues/:venueId
venuesRouter.delete("/:venueId", requireAdmin, async (req, res, next) => {
  const venueId = req.params.venueId;
  try {
    // check to see if artist id exists
    const venue = await getVenueById(venueId);
    if (!venue) {
      const err = new Error(`Venue ${venueId} not found`);
      err.status = 400;
      err.name = "venue does not exist";
      next(err);
    }
    // delete artist
    const deletedVenue = await destroyVenue(venueId);
    res.send(deletedVenue);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = venuesRouter;
