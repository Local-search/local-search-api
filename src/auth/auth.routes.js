const authRoutes = require("express").Router();
const { login, register, verifyOtp } = require("./auth.controller");

authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.post("/verify-otp", verifyOtp);

module.exports = authRoutes;
