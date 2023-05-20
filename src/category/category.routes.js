const {
  verifyJwt,
  verifyUser,
  verifyAdmin,
} = require("../auth/auth.middleware");
const {
  createCategory,
  getCategoryById,
  getCategories,
  updateCategory,
  deleteCategory,
  mostPopularCatg,
  getAllCategories
} = require("./category.controller");

const categoryRoutes = require("express").Router();

categoryRoutes.get("/popular", mostPopularCatg);
categoryRoutes.use(verifyJwt);
categoryRoutes.get("/all", verifyAdmin, getAllCategories);
categoryRoutes.get("/", verifyUser, getCategories);
categoryRoutes.post("/", verifyAdmin, createCategory);
categoryRoutes.get("/:id", getCategoryById);
categoryRoutes.use(verifyAdmin);
categoryRoutes.put("/:id", updateCategory);
categoryRoutes.delete("/:id", deleteCategory);

module.exports = categoryRoutes;
