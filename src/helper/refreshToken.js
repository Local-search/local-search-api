const { JWT_SEC, REFRESH_SEC } = require("../config/secrets");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ERROR = require("../utils/Error");

const RefreshToken = async (req, res, next) => {
  const { jwt: refreshToken } = req.cookies;
  
  if (!refreshToken) {
    return next(ERROR(404, "Cookies not available"));
  }

  try {
    const userFound = await User.findOne({ refreshToken });

    if (!userFound) {
      return next(ERROR(400, "Invalid refresh token"));
    }

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
      { expiresIn: "1m" }
    );
    
    res.status(201).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

module.exports = RefreshToken;
