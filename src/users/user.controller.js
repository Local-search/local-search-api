const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const ERROR = require("../utils/Error");

const createUser = async (req, res, next) => {
  const { firstName, lastName, userName, email, phone, password, role } = req.body;

  if (!firstName || !lastName || !userName || !email || !phone || !password) {
    return next(ERROR(400, "All feilds are Required"));
  }
  try {
    const userFound = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (userFound) {
      return next(ERROR(409, "Email or phone number is already registered!"));
    }
    const salt = bcrypt.genSaltSync(5);
    const hash = bcrypt.hashSync(password, salt);
    const newObj = {
      firstName,
      lastName,
      userName,
      email,
      phone,
      password: hash, role
    };
    if (newObj) {
      const newUser = await User.create(newObj);
      const { password, ...otherDetails } = newUser._doc;
      res
        .status(201)
        .json({ message: `New user ${username} Created`, ...otherDetails });
    } else {
      res.status(400).json({ message: "Invalid DATA" });
    }
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").lean();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  const id = req.id;
  try {
    const user = await User.findById({ _id: id }).select("-password").lean();
    if (!user) {
      return next(ERROR(401, "User not found."));
    }
    res.status(200).json({
      userInfo: user,
    });
  } catch (err) {
    next(err);
  }
};
const updateUser = async (req, res, next) => {
  const { password } = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.id,
      {
        $set: [{ password: password }],
      },
      { new: true }
    ).select("fullName email phone status");

    res.status(201).json({ updateUser });
  } catch (err) {
    next(err);
  }
};
const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete({ _id: id });
    if (!deletedUser) {
      return next(ERROR(400, "User not Found"));
    }
    res.status(200).json({ message: `Account has been Deleted!` });
  } catch (err) {
    next(err);
  }
};
module.exports = { createUser, getUsers, getUser, deleteUser, updateUser };
