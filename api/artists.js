const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getAllArtists } = require("../db/artists");
const artistRouter = express.Router();

artistRouter.get("/", async (req, res, next) => {
  try {
    const artists = await getAllArtists();
    res.send(artists);
    return;
  } catch (error) {
    next(error);
    return;
  }
});

module.exports = artistRouter;
