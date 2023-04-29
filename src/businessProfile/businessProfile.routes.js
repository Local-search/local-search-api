const { verifyUser, verifyJwt } = require("../auth/auth.middleware");
const {
  createBusinessProfile,
  getBusinessProfileById,
  getAllBusinessProfile,
  updateBusinessProfileById,
  deleteBusinessProfileById,
  TrendingBusiness,
} = require("./businessProfile.controller");

const businessProfileRoutes = require("express").Router();
businessProfileRoutes.get("/trending", TrendingBusiness);
businessProfileRoutes.get("/", getAllBusinessProfile);
businessProfileRoutes.get("/:id", getBusinessProfileById);
businessProfileRoutes.use(verifyJwt);
businessProfileRoutes.post("/", verifyUser, createBusinessProfile);
businessProfileRoutes.put("/:id", verifyUser, updateBusinessProfileById);
businessProfileRoutes.delete("/:id", verifyUser, deleteBusinessProfileById);
module.exports = businessProfileRoutes;
