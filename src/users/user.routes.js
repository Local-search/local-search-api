const {
  verifyJwt,
  verifyUser,
  verifyAdmin,
  verifyIsSameUser,
} = require("../auth/auth.middleware");
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require("./user.controller");

const userRoutes = require("express").Router();

userRoutes.use(verifyJwt);
userRoutes.get("/all", verifyAdmin, getUsers);
userRoutes.post("/", verifyAdmin, createUser);

userRoutes.use(verifyIsSameUser);
userRoutes.get("/:id", getUser);
userRoutes.delete("/:id", deleteUser);
userRoutes.put("/:id", updateUser);

module.exports = userRoutes;
