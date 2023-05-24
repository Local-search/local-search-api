const mongoose = require("mongoose");
const ERROR = require("../utils/Error");

const categorySchema = new mongoose.Schema({
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
// categorySchema.pre("save", async function (next) {
//   const self = this;

//   if (self.isModified("label")) {
//     try {
//       const category = await mongoose.models.Categorys.findOne({ label: self.label });

//       if (category) {
//         if (category?.status === "false") {
//           return next(ERROR(400, `${category.label} category is already creadet wait for admin to verify it`));
//         } else {
//           return next(ERROR(400, `${category.label} category is already exist`));
//         }
//       }
      
//       next();
//     } catch (err) {
//       return next(err);
//     }
//   } else {
//     next();
//   }
// });


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
categorySchema.index({ label: 1 }, { unique: true });

const CategoryModel = mongoose.model("Categorys", categorySchema);
module.exports = CategoryModel;
