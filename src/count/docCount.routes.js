const { verifyJwt, verifyAdmin } = require("../auth/auth.middleware");
const {
  countCatg,
  countKeyword,
  countBusiness,
  countAds,
  countUser,
} = require("./docCount.controller");

const docCountRoutes = require("express").Router();
docCountRoutes.use(verifyJwt);
docCountRoutes.use(verifyAdmin);
docCountRoutes.get("/catg", countCatg);
docCountRoutes.get("/keyword", countKeyword);
docCountRoutes.get("/business", countBusiness);
docCountRoutes.get("/ads", countAds);
docCountRoutes.get("/user", countUser);

module.exports = docCountRoutes;
