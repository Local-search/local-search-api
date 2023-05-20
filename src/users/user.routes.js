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
userRoutes.get("/:id", verifyIsSameUser, getUser);
userRoutes.delete("/:id", verifyIsSameUser, deleteUser);
userRoutes.put("/:id", verifyIsSameUser, updateUser);
userRoutes.use(verifyAdmin);
userRoutes.get("/", getUsers);
userRoutes.post("/", createUser);

module.exports = userRoutes;
