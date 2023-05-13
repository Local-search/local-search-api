const { verifyUser, verifyJwt } = require("../auth/auth.middleware");
const {
  createBusinessProfile,
  getBusinessProfileById,
  getAllBusinessProfile,
  getSearchBusinessProfile,
  updateBusinessProfileById,
  deleteBusinessProfileById,
  TrendingBusiness,
  getBusinessWithCatgId,
  getBusinessWithKeywordId,
} = require("./businessProfile.controller");

const businessProfileRoutes = require("express").Router();
businessProfileRoutes.get("/all", getAllBusinessProfile);
businessProfileRoutes.get("/", getSearchBusinessProfile);
businessProfileRoutes.get("/trending", TrendingBusiness);
businessProfileRoutes.get("/keyword/:ids", getBusinessWithKeywordId);
businessProfileRoutes.get("/catg/:ids", getBusinessWithCatgId);
businessProfileRoutes.get("/:id", getBusinessProfileById);
businessProfileRoutes.use(verifyJwt);
businessProfileRoutes.post("/", verifyUser, createBusinessProfile);
businessProfileRoutes.put("/:id", verifyUser, updateBusinessProfileById);
businessProfileRoutes.delete("/:id", verifyUser, deleteBusinessProfileById);
module.exports = businessProfileRoutes;
// merge test