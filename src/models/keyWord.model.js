const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
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
});
keywordSchema.index(
  { label: "text" },
  { partialFilterExpression: { status: true } }
);
keywordSchema.index(
  { status: 1 },
  { partialFilterExpression: { status: false } }
);
keywordSchema.index(
  { status: 1, popular: -1 },
  { partialFilterExpression: { status: true } }
);
const KeywordModel = mongoose.model("Keywords", keywordSchema);
module.exports = KeywordModel;
