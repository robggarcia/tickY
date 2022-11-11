const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getAllArtists, getArtistById } = require("../db/artists");
const { ArtistExistsError } = require("../errors");
const artistRouter = express.Router();

// GET /api/artists
artistRouter.get("/", async (req, res, next) => {
  try {
    const artists = await getAllArtists();
    res.send(artists);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/artists/:artistId
artistRouter.get("/:artistId", async (req, res, next) => {
  const artistId = req.params.artistId;
  try {
    const artist = await getArtistById(artistId);
    if (!artist) {
      const err = new Error(`Artist id ${artistId} does not exit`);
      err.status = 400;
      err.name = "InvalidArtistId";
      next(err);
    }
    res.send(artist);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = artistRouter;
