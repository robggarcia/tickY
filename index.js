const express = require("express");
const apiRouter = require("./api");

const app = express();

app.use("/api", apiRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server is up on ", PORT);
});
