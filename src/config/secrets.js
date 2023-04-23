require("dotenv").config({});
module.exports = {
  MONGO_API_KEY: process.env.MONGO_API_KEY,
  JWT_SEC: process.env.JWT_SEC,
  REFRESH_SEC: process.env.REFRESH_SEC,
  PORT: process.env.PORT,
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
};
