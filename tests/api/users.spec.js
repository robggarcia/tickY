require("dotenv").config();
const request = require("supertest");
const faker = require("faker");
const { app, appServer } = require("../..");
const client = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const {
  createFakeUserWithToken,
  createFakeUserWithRoutines,
  createFakeUserWithOrders,
  createFakeOrder,
  createFakeTicket,
  createFakeTicketOrder,
  createFakeTicketWithArtistAndVenue,
  createFakeAdmin,
  createFakeUser,
} = require("../helpers");
const {
  expectToBeError,
  expectNotToBeError,
  expectToHaveErrorMessage,
} = require("../expectHelpers");

const { getPublicRoutinesByUser, getAllRoutinesByUser } = require("../../db");

const {
  UserTakenError,
  PasswordTooShortError,
  UnauthorizedError,
  UserDoesNotExistError,
  UserAccessError,
} = require("../../errors");
const { createUser } = require("../../db/users");
const { getOrdersByUserId } = require("../../db/order");

afterAll(() => {
  console.log("tests finished running");
  appServer.close();
});

describe("/api/users", () => {
  describe("POST /api/users/register", () => {
    it("Creates a new user.", async () => {
      // Create some fake user data
      const fakeUserData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      // Register the user
      const response = await request(app)
        .post("/api/users/register")
        .send(fakeUserData);

      expectNotToBeError(response.body);

      expect(response.body).toMatchObject({
        message: expect.any(String),
        token: expect.any(String),
        user: {
          id: expect.any(Number),
          username: fakeUserData.username,
        },
      });
    });

    it("Hashes password before saving user to DB.", async () => {
      // Create some fake user data
      const fakeUserData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };

      // Create the user through the API
      const response = await request(app)
        .post("/api/users/register")
        .send(fakeUserData);

      expectNotToBeError(response.body);

      // Grab the user from the DB manually so we can
      // get the hashed password and check it
      const {
        rows: [user],
      } = await client.query(
        `
          SELECT *
          FROM users
          WHERE id = $1;
        `,
        [response.body.user.id]
      );

      const hashedPassword = user.password;

      // The original password and the hashedPassword shouldn't be the same
      expect(fakeUserData.password).not.toBe(hashedPassword);
      // Bcrypt.compare should return true.
      expect(await bcrypt.compare(fakeUserData.password, hashedPassword)).toBe(
        true
      );
    });

    it("Throws errors for duplicate email", async () => {
      // Create a fake user in the DB
      const { fakeUser: firstUser } = await createFakeUserWithToken();
      // Now try to create a user with the same email
      const secondUserData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: firstUser.email,
      };

      const response = await request(app)
        .post("/api/users/register")
        .send(secondUserData);

      expectToBeError(response.body);

      expectToHaveErrorMessage(response.body, UserTakenError(firstUser.email));
    });

    it("returns error if password is less than 8 characters.", async () => {
      // Create some user data with a password with 7 characters
      const newUserShortPassword = {
        username: faker.internet.userName(),
        password: faker.internet.password(7),
        email: faker.internet.email(),
      };

      const response = await request(app)
        .post("/api/users/register")
        .send(newUserShortPassword);

      expectToHaveErrorMessage(response.body, PasswordTooShortError());
    });
  });

  describe("POST /api/users/login", () => {
    it("Logs in the user. Requires username, password and email, and verifies that hashed login password matches the saved hashed password.", async () => {
      // Create some fake user data
      const userData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      // Create the user in the DB
      await createUser(userData);
      // Login the user
      const response = await request(app)
        .post("/api/users/login")
        .send(userData);

      expectNotToBeError(response.body);

      expect(response.body).toMatchObject({
        message: "you're logged in!",
      });
    });

    it("Logs in the user and returns the user back to us", async () => {
      // Create some fake user data
      const userData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      // Create the user in the DB
      const user = await createUser(userData);
      // Login the user
      const response = await request(app)
        .post("/api/users/login")
        .send(userData);

      expectNotToBeError(response.body);

      // The body should contain the user info
      expect(response.body).toMatchObject({
        user,
      });
    });

    it("Returns a JSON Web Token. Stores the id and username in the token.", async () => {
      const userData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      // Create the user in the DB
      const user = await createUser(userData);
      // Login the user
      const { body } = await request(app)
        .post("/api/users/login")
        .send(userData);

      expectNotToBeError(body);

      expect(body).toMatchObject({
        token: expect.any(String),
      });
      // Verify the JWT token
      const parsedToken = jwt.verify(body.token, JWT_SECRET);
      // The token should return an object that contains userId and username
      expect(parsedToken.id).toEqual(user.id);
      expect(parsedToken.username).toEqual(user.username);
    });
  });

  describe("GET /api/users/me (*)", () => {
    it("sends back users data if valid token is supplied in header", async () => {
      const { fakeUser, token } = await createFakeUserWithToken();
      const response = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${token}`);
      expectNotToBeError(response.body);
      expect(response.body).toMatchObject(fakeUser);
    });

    it("rejects requests with no valid token", async () => {
      const response = await request(app).get("/api/users/me");
      expect(response.status).toBe(401);
      expectToHaveErrorMessage(response.body, UnauthorizedError());
    });
  });

  describe("GET /api/users/:userId/orders (*)", () => {
    it("Gets a list of orders for a particular user.", async () => {
      // Create a fake user that has an order
      const { fakeUser, token } = await createFakeUserWithToken();

      const order = await createFakeOrder(fakeUser.id);
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fullOrder = createFakeTicketOrder({
        orderId: order.id,
        ticketId: fakeTickets[0].id,
        quantity: 1,
      });

      const response = await request(app)
        .get(`/api/users/${fakeUser.id}/orders`)
        .set("Authorization", `Bearer ${token}`);

      expectNotToBeError(response.body);

      // Get the orders from the DB
      const ordersFromDB = await getOrdersByUserId(fakeUser.id);

      expect(response.body.id).toEqual(ordersFromDB.id);
    });

    it("gets a list of all orders for the logged in user", async () => {
      // Create a fake user that has an order
      const { fakeUser, token } = await createFakeUserWithToken();

      const order = await createFakeOrder(fakeUser.id);
      const { fakeTickets } = await createFakeTicketWithArtistAndVenue();
      const fullOrder = createFakeTicketOrder({
        orderId: order.id,
        ticketId: fakeTickets[0].id,
        quantity: 1,
      });

      const response = await request(app)
        .get(`/api/users/${fakeUser.id}/orders`)
        .set("Authorization", `Bearer ${token}`);

      expectNotToBeError(response.body);

      const ordersFromDB = await getOrdersByUserId(fakeUser.id);

      expect(response.body.id).toEqual(ordersFromDB.id);
    });
  });

  // PATCH api/users/:userId
  describe("PATCH /api/users/:userId (*)", () => {
    it("Logged in user can update themselves", async () => {
      const { fakeUser, token } = await createFakeUserWithToken();

      const newFakeUserData = {
        username: "Tim Jim Bobby",
        email: "tim@jim.com",
      };

      const response = await request(app)
        .patch(`/api/users/${fakeUser.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newFakeUserData);

      expectNotToBeError(response.body);

      expect(response.body).toEqual({
        id: fakeUser.id,
        admin: false,
        email: fakeUser.email,
        ...newFakeUserData,
      });
    });

    it("returns an error when updating a user that does not exist", async () => {
      const { token } = await createFakeAdmin();

      const newFakeUserData = {
        username: "Johnny Brenda",
        email: "phillyboy@jb.com",
      };

      const response = await request(app)
        .patch(`/api/users/10000`)
        .set("Authorization", `Bearer ${token}`)
        .send(newFakeUserData);

      expectToHaveErrorMessage(response.body, UserDoesNotExistError(10000));
    });

    it("returns an error when changing a user to have the email of an existing user", async () => {
      const { token } = await createFakeAdmin();

      const fakeUser = await createFakeUser();
      const secondFakeUser = await createFakeUser();

      const newUserData = {
        email: secondFakeUser.email,
        username: "Alexander",
      };

      const response = await request(app)
        .patch(`/api/users/${fakeUser.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(newUserData);

      expectToHaveErrorMessage(
        response.body,
        UserTakenError(secondFakeUser.email)
      );
      expectToBeError(response.body);
    });
  });

  describe("DELETE /api/users/:userId (**)", () => {
    it("Admin can delete a user", async () => {
      const { token } = await createFakeAdmin();
      const fakeUser = await createFakeUser();

      const response = await request(app)
        .delete(`/api/users/${fakeUser.id}`)
        .set("Authorization", `Bearer ${token}`);

      expectNotToBeError(response.body);

      expect(response.body.email).toEqual(fakeUser.email);
    });

    it("returns an error when deleting a user that does not exist", async () => {
      const { token } = await createFakeAdmin();

      const response = await request(app)
        .delete(`/api/users/10000`)
        .set("Authorization", `Bearer ${token}`);

      expectToHaveErrorMessage(response.body, UserDoesNotExistError(10000));
    });
  });
});
