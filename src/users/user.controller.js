const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const ERROR = require("../utils/Error");

const createUser = async (req, res, next) => {
  const { firstName, lastName, username, email, phone, password, role } = req.body;

  if (!firstName || !lastName || !username || !email || !phone || !password) {
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
      username,
      email,
      phone,
      password: hash, 
      role
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
    const user = await User.findById({ _id: id }).select("firstName lastName username phone email").lean().exec();
    if (!user) {
      return next(ERROR(401, "User not found."));
    }
    res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
};
const updateUser = async (req, res, next) => {
  const { password, firstName, lastName, phone, email } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(ERROR(404, "user not found!!"))
    }
    if (user.email !== email) {
      user.status = "false";
      user.email = email;
    }
    if (user.firstName !== firstName) {
      user.firstName = firstName;
    }
    if (user.lastName !== lastName) {
      user.lastName = lastName;
    }
    if (user.phone !== phone) {
      user.phone = phone;
    }
    if (password) {
      const salt = bcrypt.genSaltSync(5);
      const hash = bcrypt.hashSync(password, salt);
      user.password = hash;
    }

    await user.save();
    res.status(201).json({ message: "profile updated!!" });
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
