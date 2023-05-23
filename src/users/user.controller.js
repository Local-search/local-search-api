const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const ERROR = require("../utils/Error");
const PasswordUtils = require("../utils/PasswordUtils");
const sendResetPasswordTokenEmail = require("./emailTemplate/sendRestePasswordToken");
const { JWT_SEC } = require("../config/secrets");

const createUser = async (req, res, next) => {
  const { firstName, lastName, username, email, phone, password, role } = req.body;

  if (!firstName || !lastName || !username || !email || !phone || !password) {
    return next(ERROR(400, "All fields are required"));
  }

  try {
    const userFound = await User.findOne({ $or: [{ email }, { phone }] });

    if (userFound) {
      return next(ERROR(409, "Email or phone number is already registered!"));
    }

    // const salt = bcrypt.genSaltSync(10);
    // const hashedPassword = bcrypt.hashSync(password, salt);
    const hashedPassword = PasswordUtils.generateHash(password);

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      phone,
      password: hashedPassword,
      role
    });

    const { password: omitPassword, ...otherDetails } = newUser._doc;

    res.status(201).json({ message: `New user ${username} created`, ...otherDetails });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  if (isNaN(page) || isNaN(limit)) {
    return next(ERROR(400, "Invalid page or limit value"));
  }

  try {
    const count = await User.countDocuments();
    const totalPages = Math.ceil(count / limit);

    const users = await User.find()
      .select("-password -refreshToken")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.status(200).json({ result: users, count, totalPages, page, limit });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("firstName lastName username phone email status image").lean();

    if (!user) {
      return next(ERROR(401, "User not found"));
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const { currentPassword, newPassword, firstName, lastName, phone, email, image } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return next(ERROR(404, "User not found"));
    }

    if (email && user.email !== email) {
      user.status = "false";
      user.email = email;
    }

    if (firstName && user.firstName !== firstName) {
      user.firstName = firstName;
    }

    if (lastName && user.lastName !== lastName) {
      user.lastName = lastName;
    }

    if (phone && user.phone !== phone) {
      user.phone = phone;
    }

    if (image && user.image !== image) {
      user.image = image;
    }

    if (currentPassword && newPassword) {
      if (currentPassword === newPassword) return next(ERROR(409, "current password and new password are same please choose different password"))
      const isMatch = PasswordUtils.comparePasswords(currentPassword, user.password);
      if (!isMatch) {
        return next(ERROR(401, "Incorrect password!"));
      }
      const hashedPassword = PasswordUtils.generateHash(newPassword);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(201).json({ message: "Profile updated" });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Check if the user exists in your database
    const user = await User.findOne({ email });

    if (!user) return next(ERROR(401, 'User not found'))

    const token = await sendResetPasswordTokenEmail(next, email, user._id)
    user.resetToken = token;
    user.resetTokenExpiresAt = Date.now() + 600000;
    await user.save();

    res.status(200).json({ message: 'Password reset email sent' });

  } catch (err) {
    next(err)
  }
}
const resetUserPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  if (!token) return next(ERROR(401, "Url is not valid"))

  if (!newPassword) return next(ERROR(400, "Enter strong password"))

  try {
    const decodedToken = jwt.verify(token, JWT_SEC);

    const user = await User.findOne({
      _id: decodedToken.id,
      resetToken: token,
      resetTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) return next(ERROR(400, "Invalid token or token expired"))


    const hashedPassword = PasswordUtils.generateHash(newPassword);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    next(err)
  }

}
const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return next(ERROR(400, "User not found"));


    res.status(200).json({ message: "Account has been deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { createUser, getUsers, getUser, deleteUser, updateUser, forgotPassword, resetUserPassword };
