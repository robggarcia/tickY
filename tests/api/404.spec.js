require("dotenv").config();
const request = require("supertest");
const { app, appServer } = require("../../index.js");

afterAll(() => {
  console.log("tests finished running");
  appServer.close();
});

describe("/api/unknown", () => {
  it("should return a 404", async () => {
    const response = await request(app).get("/api/unknown");
    expect(response.status).toEqual(404);
    // the 404 response returns an object with a message property
    expect(typeof response.body.message).toEqual("string");
  });
});
