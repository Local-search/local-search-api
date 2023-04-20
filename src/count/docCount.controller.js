const categoryModel = require("../models/category.model");
const keywordModel = require("../models/keyWord.model");
const businessProfileModel = require("../models/businessProfile.model");

const count = async (req, res, next, model, status) => {
  try {
    const result = await model.countDocuments({
      $and: [{ status: status || "false" }],
    });
    res.status(201).json({ result });
  } catch (err) {
    next(err);
  }
};
exports.countCatg = async (req, res, next) => {
  const { status } = req.query;
  if (status === "true") {
    count(req, res, next, categoryModel, true);
  } else {
    count(req, res, next, categoryModel);
  }
};
exports.countKeyword = async (req, res, next) => {
  const { status } = req.query;
  if (status === "true") {
    count(req, res, next, keywordModel, true);
  } else {
    count(req, res, next, keywordModel);
  }
};
exports.countBusiness = async (req, res, next) => {
  const { status } = req.query;
  if (status === "true") {
    count(req, res, next, businessProfileModel, true);
  } else {
    count(req, res, next, businessProfileModel);
  }
};
