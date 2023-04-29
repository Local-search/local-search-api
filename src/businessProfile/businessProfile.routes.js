const {
  verifyUser,
  verifyJwt,
  verifyIsSameUser,
} = require("../auth/auth.middleware");
const {
  createBusinessProfile,
  getBusinessProfileById,
  getAllBusinessProfile,
  updateBusinessProfileById,
  deleteBusinessProfileById,
  trendingBusiness
} = require("./businessProfile.controller");

const businessProfileRoutes = require("express").Router();
businessProfileRoutes.get("/:id", getBusinessProfileById);
businessProfileRoutes.get("/", getAllBusinessProfile);
businessProfileRoutes.get("/trending", trendingBusiness);
businessProfileRoutes.use(verifyJwt);
businessProfileRoutes.post("/", verifyUser, createBusinessProfile);
businessProfileRoutes.put("/:id", verifyUser, updateBusinessProfileById);
businessProfileRoutes.delete("/:id", verifyUser, deleteBusinessProfileById);
module.exports = businessProfileRoutes;
