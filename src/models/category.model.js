const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
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
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    // required: true,
  }
});
categorySchema.index(
  { label: "text" },
  { partialFilterExpression: { status: "true" } }
);
categorySchema.index(
  { status: 1 },
  { partialFilterExpression: { status: "false" } }
);
categorySchema.index(
  { status: 1, popular: -1 },
  { partialFilterExpression: { status: "true" } }
);
const CategoryModel = mongoose.model("Categorys", categorySchema);
module.exports = CategoryModel;
