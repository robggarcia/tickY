const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getArtistById, getAllArtists } = require("../db/artists");
const artistsRouter = express.Router();

// GET /api/artists
artistsRouter.get("/", async (req, res, next) => {
  try {
    const artists = await getAllArtists();
    res.send(artists);
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// GET /api/artists/:artistId
artistsRouter.get("/:artistId", async (req, res, next) => {
  const artistId = req.params.artistId;
  try {
    const artist = await getArtistById(artistId);
    if (!artist) {
      const err = new Error(`Artist id ${artistId} does not exist`);
      err.status = 400;
      err.name = "UnknownArtistError";
    }
    res.send(artist);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = artistsRouter;
