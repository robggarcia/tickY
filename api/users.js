const express = require("express");
const jwt = require("jsonwebtoken");
const {
  getUser,
  getUserByUsername,
  createUser,
  updateUser,
  getAllUsers,
  getUserByEmail,
} = require("../db/users");
const { requireUser, requireAdmin } = require("./utils");
const usersRouter = express.Router();
const { JWT_SECRET } = process.env;

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log("REQUEST MADE TO /users/login", req);
  // make sure both username and password are provided
  if (!username || !password) {
    const err = new Error("Please provide username and password.");
    err.status = 400;
    next(err);
  }
  try {
    const user = await getUser({ username, password });
    if (!user) {
      const err = new Error("Bad Credentials.");
      err.status = 400;
      next(err);
    }
    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.send({ message: "you're logged in!", token, user });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password, email } = req.body;
  try {
    // check if password is less than 8 characters
    if (password.length < 8) {
      res.send({
        error: "PasswordLengthError",
        message: "Password Too Short!",
        name: "password",
      });
      return;
    }

    // check to see if email exists
    const _user = await getUserByEmail(email);
    if (_user) {
      const err = new Error(`User ${_user.email} is already taken.`);
      err.status = 404;
      err.name = "UserExistsError";
      next(err);
    }

    // create a new user
    const user = await createUser({ username, password, email });
    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.send({
      message: "User successfully registered",
      token,
      user,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/me
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/:userId/orders
usersRouter.get("/:userId/orders", requireUser, async (req, res, next) => {
  const userId = req.params.userId;
  const inputFields = req.body;
  try {
    inputFields.id = userId;
    const updatedUser = await updateUser(inputFields);
    res.send(updatedUser);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH api/users/:userId
usersRouter.get(":userId", requireUser, async (req, res, next) => {
  const userId = req.params.userId;
  const inputFields = req.body;
  inputFields.id = userId;
  try {
    const updatedUser = await updateUser(inputFields);
    res.send(updatedUser);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET api/users
usersRouter.get("/", requireAdmin, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;
