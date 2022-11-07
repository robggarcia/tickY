const client = require("../db");

const tearDown = async ({ watch, watchAll }) => {
  if (watch || watchAll) {
    return;
  }
  await client.end();
  console.log("Client Ended");
};

module.exports = tearDown;
