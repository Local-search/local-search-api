const categoryModel = require("../models/category.model");
const keywordModel = require("../models/keyWord.model");
const businessProfileModel = require("../models/businessProfile.model");
const AdvertisementModel = require("../models/advertisement.model");
const User = require("../models/user.model");
const count = async (req, res, next, model, status) => {
  try {
    if (status === "total") {
      const result = await model.countDocuments();
      res.status(200).json(result);

    } else {
      const result = await model.countDocuments({
        $and: [{ status: status || "true" }],
      });
      res.status(200).json(result);
    }
  } catch (err) {
    next(err);
  }
};
exports.countCatg = async (req, res, next) => {
  const { status } = req.query;
  if (status) {
    count(req, res, next, categoryModel, status);
  } else {
    count(req, res, next, categoryModel);
  }
};
exports.countKeyword = async (req, res, next) => {
  const { status } = req.query;
  if (status) {
    count(req, res, next, keywordModel, status);
  } else {
    count(req, res, next, keywordModel);
  }
};
exports.countBusiness = async (req, res, next) => {
  const { status } = req.query;
  if (status) {
    count(req, res, next, businessProfileModel, status);
  } else {
    count(req, res, next, businessProfileModel);
  }
};
exports.countAds = async (req, res, next) => {
  const { status } = req.query;
  if (status === "false") {
    count(req, res, next, AdvertisementModel, "PENDING");
  } else if (status === "true") {
    count(req, res, next, AdvertisementModel, "APPROVED");
  } else if (status == "total") {
    count(req, res, next, AdvertisementModel, status);
  } else {
    count(req, res, next, AdvertisementModel, "REJECTED");
  }
};
exports.countUser = async (req, res, next) => {
  const { status } = req.query;
  if (status) {
    count(req, res, next, User, status);
  } else {
    count(req, res, next, User);
  }
};
