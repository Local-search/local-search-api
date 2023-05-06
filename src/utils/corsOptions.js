const ERROR = require("./Error");
const whitelist = require("./whitelist");
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(ERROR(401, "not allowed by Cors"));
    }
  },
};
module.exports = corsOptions;
