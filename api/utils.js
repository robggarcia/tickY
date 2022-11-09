const requireUser = (req, res, next) => {
  if (!req.user) {
    const err = new Error("You must be logged in to perform this action");
    err.status = 401;
    next(err);
  }
  next();
};

const requireAdmin = (req, res, next) => {
  const user = req.user;
  if (!user.admin) {
    const err = new Error("Admin must be logged in to perform this action");
    err.status = 401;
    next(err);
  }
  next();
};

module.exports = { requireUser, requireAdmin };
