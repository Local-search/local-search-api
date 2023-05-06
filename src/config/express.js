const express = require("express");
const cors = require("cors");
const errorHandler = require("../middleware/errorHandler.middleware");
const routes = require("../../routes");
const cookieParser = require("cookie-parser");
const corsOptions = require("../utils/corsOptions");
const accessControl = require("../middleware/accessControl");
const app = express();

app.use(accessControl);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(errorHandler);

app.use("*", (_, res, next) => {
  res.status(404).json("routes not avaliable on this name ⛔");
});

module.exports = app;
