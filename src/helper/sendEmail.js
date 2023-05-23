const { MAIL_USERNAME, MAIL_PASSWORD } = require("../config/secrets");
const nodemailer = require("nodemailer");
const ERROR = require("../utils/Error");

const sendEmail = async (toEmail, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `LOCAL SEARCH NEPAL <${MAIL_USERNAME}>`,
      to: toEmail,
      subject: subject,
      text: text,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully:", info.messageId);
  } catch (err) {
    // console.error("Error sending email:", err);
    throw ERROR(402, "Failed to send email");
  }
};

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