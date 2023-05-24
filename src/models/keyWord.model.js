const mongoose = require("mongoose");
const ERROR = require("../utils/Error");

const keywordSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["false", "true"],
    default: "false",
  },
  popular: {
    type: Number,
    default: 5,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    // required: true,
  }
});
keywordSchema.index(
  { label: "text" },
  { partialFilterExpression: { status: "true" } }
);
keywordSchema.index(
  { status: 1 },
  { partialFilterExpression: { status: "false" } }
);
keywordSchema.index(
  { status: 1, popular: -1 },
  { partialFilterExpression: { status: "true" } }
);
const KeywordModel = mongoose.model("Keywords", keywordSchema);
module.exports = KeywordModel;
