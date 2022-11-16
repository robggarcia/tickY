require("dotenv").config();
const request = require("supertest");
const { app, appServer } = require("../..");
const { NonExistingOrderError } = require("../../errors");
const {
  expectNotToBeError,
  expectToHaveErrorMessage,
} = require("../expectHelpers");
const {
  createFakeUser,
  createFakeOrder,
  createFakeUserWithToken,
  createFakeAdmin,
  createFakeTicketWithArtistAndVenue,
  createFakeTicketOrder,
} = require("../helpers");

afterAll(() => {
  console.log("tests finished running");
  appServer.close();
});

describe("api/tickets", () => {
  // GET /api/tickets
  // GET /api/tickets/:ticketId
  // POST /api/tickets
  // PATCH /api/tickets/:ticketId
  // DELETE /api/tickets/:ticketId
});
