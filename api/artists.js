const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const {
  getArtistById,
  getAllArtists,
  getArtistByName,
  createArtist,
} = require("../db/artists");
const { getTicketsByArtist } = require("../db/tickets");
const { requireAdmin } = require("./utils");
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

// GET /api/artists/:artistId/tickets
artistsRouter.get("/:artistId/tickets", async (req, res, next) => {
  const artistId = req.params.artistId;
  try {
    const tickets = await getTicketsByArtist(artistId);
    if (!tickets) {
      const err = new Error(`No tickets from artist id ${artistId} exist`);
      err.status = 400;
      err.name = "NotTicketsWithArtistError";
      next(err);
      return;
    }
    res.send(tickets);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST api/artists
artistsRouter.post("/", requireAdmin, async (req, res, next) => {
  const inputFields = req.body;
  try {
    // check to see if the artist already exists (check artist and venue)
    const existingArtist = await getArtistByName(inputFields.name);
    if (existingArtist) {
      const err = new Error(
        `An artist with name ${inputFields.name} already exists`
      );
      err.status = 400;
      err.name = "ExistingArtistError";
      next(err);
      return;
    }
    // create the new ticket
    const artist = await createArtist(inputFields);
    res.send(artist);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = artistsRouter;
