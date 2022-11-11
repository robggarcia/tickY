const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getArtist } = require("../db/artists");
const artistRouter = express.Router();

artistRouter.get("/", async (req, res, next) => {
  try {
    const artists = await getArtist();
    res.send(artists);
    return;
  } catch (error) {
    next(error);
    return;
  }
});

module.exports = router;
