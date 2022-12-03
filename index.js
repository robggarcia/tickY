require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const apiRouter = require("./api");

const app = express();

// Setup middleware and API Router
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

// Have Node serve the files for our built React app
app.use(express.static(path.join(__dirname, "client", "build")));

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 4000;
const appServer = app.listen(PORT, () => {
  console.log("Server is up on ", PORT);
});

module.exports = { app, appServer };
