const jwt = require("jsonwebtoken");
const { JWT_SEC } = require("../config/secrets");
const ERROR = require("../utils/Error");

const verifyJwt = (req, res, next) => {
  const authTokenInHeader = req.headers.authorization;
  if (!authTokenInHeader) {
    return next(ERROR(401, "header is empty"));
  }
  const token = authTokenInHeader.split(" ")[1];
  if (!token) {
    return next(ERROR(401, "token not found in header"));
  }
  try {
    const decoded = jwt.verify(token, JWT_SEC);
    req.id = decoded.id;
    req.fullName = decoded.fullName;
    req.email = decoded.email;
    req.role = decoded.role;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      next(ERROR(403, "token expired!!"));
    } else {
      next(ERROR(401, "Invalid token!!"));
    }
  }
};

const verifyUser = (req, res, next) => {
  verifyJwt(req, res, () => {
    if (req.role === "USER" || req.role === "ADMIN") {
      next();
    } else {
      return next(ERROR(401, "You are not authorized to do this action!!"));
    }
  });
};
const verifyIsSameUser = (req, res, next) => {
  verifyJwt(req, res, () => {
    const checkId = req.param.id || req.body.id;
    if ((req.id === checkId && req.role === "USER") || req.role === "ADMIN") {
      next();
    } else {
      return next(ERROR(401, "You are not authorized to do this action!!"));
    }
  });
};
const verifyAdmin = (req, res, next) => {
  verifyJwt(req, res, () => {
    if (req.role === "ADMIN") {
      next();
    } else {
      return next(
        ERROR(
          401,
          "You are not authorized only Admin is authorized to do this action!!"
        )
      );
    }
  });
};
module.exports = { verifyJwt, verifyUser, verifyAdmin, verifyIsSameUser };
