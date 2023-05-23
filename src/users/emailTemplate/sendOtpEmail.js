const sendEmail = require("../../helper/sendEmail");
const ERROR = require("../../utils/Error");

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  const sendOTPEmail = async (next, email) => {
    if (!email) {
      next(ERROR(400, "email address is required to send email!"))
    }
    try {
      const otp = generateOTP();
  
      const subject = "Verification Code from LOCAL SEARCH NEPAL";
      const text = `Your verification code is ${otp}. Please enter this code to verify your account.`;
      const html = `<p>Your verification code is <strong>${otp}</strong>.</p><p>Please enter this code to verify your account.</p>`;
  
      await sendEmail(email, subject, text, html);
      return otp;
    } catch (err) {
      next(err);
    }
  };
  module.exports = sendOTPEmail