const KeywordModel = require("../models/keyWord.model");
const ERROR = require("../utils/Error");

exports.createKeyword = async (req, res, next) => {
  try {
    const { label, status } = req.body;
    if (!label) {
      return next(ERROR(401, "enter keyword name"));
    }
    if (req.role === "ADMIN") {
      const keyword = new KeywordModel({ label, status });
      await keyword.save();
      res.status(201).json({ keyword });
    } else {
      const keyword = new KeywordModel({ label });
      await keyword.save();
      res.status(201).json({ keyword });
    }
  } catch (error) {
    next(error);
  }
};

exports.getKeywords = async (req, res, next) => {
  try {
    const keywords = await KeywordModel.find();
    if (!keywords) return next(ERROR(404, "keyword not found"));

    res.json(keywords);
  } catch (error) {
    next(error);
  }
};

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
  try {
    const keyword = await KeywordModel.findByIdAndDelete(req.params.id);
    if (!keyword) {
      return next(ERROR(404, "keyword not found"));
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
