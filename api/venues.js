const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getAllArtists, getArtistById } = require("../db/artists");
const { ArtistExistsError } = require("../errors");
const venuesRouter = express.Router();

module.exports = venuesRouter;
