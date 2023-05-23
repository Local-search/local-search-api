const { JWT_SEC } = require("../../config/secrets");
const sendEmail = require("../../helper/sendEmail");
const ERROR = require("../../utils/Error");
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SEC, { expiresIn: '10m' });
}


const sendResetPasswordTokenEmail = async (next, email, id) => {
  if (!email) {
    next(ERROR(400, "email address is required to send email!"))
  }
  try {
    const token = generateToken(id);

    const subject = "Password Reset";
    const text = `click the following link to reset your password: https://local-search-itahari-dev.netlify.app/reset-password/${token}.`;
    const html = `
    <p>Please click the following link to reset your password:</p>
    <p><a href="https://local-search-itahari-dev.netlify.app/reset-password/${token}">Like: Reset Password</a></p></br>
    <p><a href="http://localhost:5173/reset-password/${token}">Local: Reset Password</a></p>`

    await sendEmail(email, subject, text, html);
    return token;
  } catch (err) {
    next(err);
  }
};
module.exports = sendResetPasswordTokenEmail