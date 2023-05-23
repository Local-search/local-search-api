const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: "Username is required",
      unique: true,
      max: 10
    },
    firstName: {
      type: String,
      required: "first name is required",
      max: 15,
    },
    lastName: {
      type: String,
      max: 15
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "inValid Email address",
      ],
      max: 40
    },
    phone: {
      type: Number,
      required: "phone number is required",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must have at least 8 characters, including at least one lowercase letter, one uppercase letter, one digit, and one special character (@ $ ! % * ? &)',
      ],
    },
    refreshToken: {
      type: String,
    },
    status: {
      type: String,
      enum: ["true", "false"],
      default: "false",
    },
    image: {
      type: String,
      max: 500
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiresAt: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);
UserSchema.index(
  { status: 1 },
  { partialFilterExpression: { status: "true" } }
);
const User = mongoose.model("Users", UserSchema);

module.exports = User;
