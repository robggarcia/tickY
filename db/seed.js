const client = require(".");
const { seedDB } = require("./seedData");

seedDB()
  .catch(console.error)
  .finally(() => client.end());
