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
      required: "email is required",
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
      required: "passowrd is required",
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,100}/,
        "At list 8 characters.Must have uppercase & lowercase letters, number and a special character: ! @ # $ %",
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
