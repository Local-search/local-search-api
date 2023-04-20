const { countCatg, countKeyword, countBusiness } = require("./docCount.controller");

const docCountRoutes = require("express").Router();
docCountRoutes.get("/catg", countCatg);
docCountRoutes.get("/keyword", countKeyword);
docCountRoutes.get("/business", countBusiness);

module.exports = docCountRoutes;
