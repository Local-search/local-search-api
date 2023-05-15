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
    if (!userFound) return next(ERROR(403, "invalid token"));
    if (userFound) {
      jwt.verify(refreshToken, REFRESH_SEC, (err, decoded) => {
        if (err || userFound.username !== decoded.username)
          return next(ERROR(403, "Token expired"));
        const accessToken = jwt.sign(
          {
            id: decoded._id,
            username: decoded.username,
          },
          JWT_SEC,
          { expiresIn: "30s" }
        );
        res.status(201).json(accessToken);
      });
    }
  } catch (err) {
    res.send(err)
  }
};

module.exports = RefreshToken