const KeywordModel = require("../models/keyWord.model");
const ERROR = require("../utils/Error");

exports.createKeyword = async (req, res, next) => {
  try {
    const { label, status } = req.body;
    if (!label) {
      return next(ERROR(401, "Enter Keyword name"));
    }

    const existingKeyword = await KeywordModel.findOne({ label });
    if (existingKeyword) {
      return next(ERROR(409, "Keyword already exists"));
    }
    const keyword = new KeywordModel({ label, status, creator: req.id });
    if (req.role !== "ADMIN") {
      keyword.status = "false"
    }
    await category.save();
    res.status(201).json({ message: "New keyword Created successfully!!" });
  } catch (error) {
    next(error);
  }
};

exports.getKeywords = async (req, res, next) => {
  try {
    const keywords = await KeywordModel.find({ status: "true" }).select("label").lean();
    if (!keywords) return next(ERROR(404, "keyword not found"));

    res.json(keywords);
  } catch (error) {
    next(error);
  }
};
exports.getAllKeywords = async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  // console.log('1', limit)

  if (isNaN(page) || isNaN(limit)) {
    return next(ERROR(400, "Invalid page or limit value"));
  }
  try {
    const count = await KeywordModel.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const keywords = await KeywordModel.find().skip((page - 1) * limit)
      .limit(limit)

    res.status(200).json({ result: keywords, count, totalPages, page, limit });
  } catch (error) {
    next(error);
  }
}
exports.getKeywordById = async (req, res, next) => {
  try {
    const keyword = await KeywordModel.findById(req.params.id);
    if (!keyword) return next(ERROR(404, "keyword not found"));
    res.json(keyword);
  } catch (error) {
    next(error);
  }
};

exports.updateKeyword = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["label", "status"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return next(ERROR(400, "Invalid update!"));
    }
    const keyword = await KeywordModel.findById(req.params.id);
    if (!keyword) {
      return next(ERROR(404, "keyword not found"));
    }
    updates.forEach((update) => {
      keyword[update] = req.body[update];
    });
    await keyword.save();
    res.json(keyword);
  } catch (error) {
    next(error);
  }
};

exports.deleteKeyword = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(ERROR(400, "keyword id is required!!"));
  }
  try {
    if (req.role === "ADMIN") {
      const keyword = await KeywordModel.findByIdAndDelete(id);
      if (!keyword) {
        return next(ERROR(404, "keyword not found"));
      }
      res.status(200).json({ message: "keyword deleted!", });
    } else {
      const keyword = await KeywordModel.findOneAndDelete({
        _id: id,
        creator: req.id
      });
      if (!keyword) {
        return next(ERROR(404, "keyword not found"));
      }
      res.status(200).json({ message: "keyword deleted!", });
    }
  } catch (err) {
    next(err);
  }
};
exports.mostPopularKeyword = async (req, res, next) => {
  try {
    const getKeywords = await KeywordModel.find({ status: "true" })
      .sort({ popular: -1 })
      .limit(24);
    res.status(200).json(getKeywords);
  } catch (err) {
    next(err);
  }
};
