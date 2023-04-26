const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    require: true,
    // unique: "A verification code has already been sent to this email address!",
    validate: {
      validator: function (value) {
        return TokenModel.countDocuments({ user: value })
          .exec()
          .then((count) => count === 0);
      },
      status: "false",
      message:
        "A verification code has already been sent to this email address!",
    },
  },
  token: { type: String, require: true },
  TokenCreatedAt: { type: Date, default: Date.now(), expires: 900 },
});
const TokenModel = mongoose.model("Token", TokenSchema);
module.exports = TokenModel;
