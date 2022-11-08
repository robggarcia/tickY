const express = require("express");
const apiRouter = require("./api");

const app = express();

// Setup middleware and API Router
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server is up on ", PORT);
});

module.exports = app;
