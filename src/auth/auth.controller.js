const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { REFRESH_SEC, JWT_SEC } = require("../config/secrets");
const crypto = require("crypto");

const User = require("../models/user.model");
const TokenModel = require("../models/token");
const sendEmail = require("../helper/sendEmail");
const ERROR = require("../utils/Error");
const sendOTPEmail = require("../helper/sendEmail");

const register = async (req, res, next) => {
  const { firstName, lastName, username, email, phone, password } = req.body;

  if (!username) {
    return next(ERROR(400, "Choose a username!"));
  }
  if (!firstName) {
    return next(ERROR(400, "Enter your first name!"));
  }
  if (!lastName) {
    return next(ERROR(400, "Enter your last name!"));
  }
  if (!email) {
    return next(ERROR(400, "Email is required!"));
  }
  if (!phone) {
    return next(ERROR(400, "Enter your phone number!"));
  }
  if (!password) {
    return next(ERROR(400, "Enter a strong password!"));
  }

  try {
    const userFound = await User.findOne({ $or: [{ email }, { phone }] });

    if (userFound?.username === username) {
      return next(ERROR(409, `${username} username is already taken!`));
    }
    if (userFound?.email === email) {
      return next(ERROR(409, "Email is already registered!"));
    }
    if (userFound?.phone === phone) {
      return next(ERROR(409, "Phone number is already registered!"));
    }

    if (!userFound) {
      const salt = bcrypt.genSaltSync(5);
      const hash = bcrypt.hashSync(password, salt);

      const createUser = new User({
        firstName,
        lastName,
        username,
        email,
        phone,
        password: hash,
      });
      await createUser.save();

      res.status(201).json({
        message: "Account created successfully!",
      });
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(ERROR(400, "Enter your email!"));
  }
  if (!password) {
    return next(ERROR(400, "Enter your password!"));
  }

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return next(ERROR(400, "Wrong credentials!"));
    }

    if (userFound.status === "false") {
      const otp = await sendOTPEmail(next, email);

      const saveToken = new TokenModel({
        user: userFound._id,
        token: otp,
      });
      await saveToken.save();

      return next(
        ERROR(
          307,
          `${userFound._id} A verification code has been sent to your email. Please check your inbox.`
        )
      );
    }

    if (userFound) {
      const matchPassword = await bcrypt.compare(password, userFound.password);

      if (!matchPassword) {
        return next(ERROR(401, "Wrong credentials!"));
      }

      if (matchPassword) {
        const accessToken = jwt.sign(
          {
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            firstName: userFound.firstName,
            phone: userFound.phone,
            role: userFound.role,
          },
          JWT_SEC,
          { expiresIn: "1m" }
        );
        const refreshToken = jwt.sign(
          {
            id: userFound._id,
            username: userFound.username,
            role: userFound.role,
          },
          REFRESH_SEC,
          { expiresIn: "5m" }
        );

        userFound.refreshToken = refreshToken;
        const result = await userFound.save();
        const { username, image } = result;

        res
          .cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 5 * 60 * 1000,
          })
          .status(200)
          .json({
            message: `Welcome back ${username}`,
            username,
            image,
            accessToken,
          });
      }
    }
  } catch (err) {
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  const { id, otp } = req.body;

  if (!id) {
    return next(ERROR(400, "ID not found!"));
  }
  if (!otp) {
    return next(ERROR(400, "Enter your verification code!"));
  }

  try {
    const isUserIdFound = await TokenModel.findOne({ user: id });

    if (!isUserIdFound) {
      return next(ERROR(404, "User not found!"));
    }
    if (isUserIdFound.token !== otp) {
      return next(ERROR(409, "Invalid OTP!"));
    }
    if (isUserIdFound.token === otp) {
      await User.findByIdAndUpdate(id, { status: "true" });
    }

    res.status(200).json({ message: "Account verified successfully!" });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, verifyOtp };
