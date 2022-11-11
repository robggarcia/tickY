const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const { getAllArtists, getArtistById } = require("../db/artists");
const { ArtistExistsError } = require("../errors");
const venuesRouter = express.Router();

module.exports = venuesRouter;
=======
const { getVenues } = require("../db/venues");
const venueRouter = express.Router();

venueRouter.get("/", async (req, res, next) => {
  try {
    const venues = await getVenues();
    res.send(venues);
    return;
  } catch (error) {
    next(error);
    return;
  }
});
>>>>>>> a218a42 (eric)
