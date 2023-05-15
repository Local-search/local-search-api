const { JWT_SEC } = require("../config/secrets");
const jwt = require("jsonwebtoken");

const { REFRESH_SEC } = require("../config/secrets");
const User = require("../models/user.model");
const ERROR = require("../utils/Error");

const RefreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return next(ERROR(404, "cookies not avalible "));
  const refreshToken = cookies.jwt;
  try {
    const userFound = await User.findOne({ refreshToken });
    if (!userFound) return next(ERROR(400, "invalid refreshtoken"));
    if (userFound) {
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_SEC);
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
          { expiresIn: "15s" }
        );
        res.status(201).json({ accessToken });

      } catch (err) {
        res.status(400).json(err)
      }
    }
  } catch (err) {
    next(err)
  }
};

module.exports = RefreshToken