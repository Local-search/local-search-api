const { MAIL_USERNAME, MAIL_PASSWORD } = require("../config/secrets");
const nodemailer = require("nodemailer");
const ERROR = require("../utils/Error");

const sendEMail = async (next, verificationCode, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      PORT: Number(8080),
      secure: true,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });

    let template = {
      from: `LOCAL SEARCH NEPAL ${MAIL_USERNAME}`,
      to: email,
      subject: "Verification Code from LOCAL SEARCH NEPAL",
      text: `Your verification code is ${verificationCode}. Please enter this code to verify your account.`,
      html: `<p>Your verification code is <strong>${verificationCode}</strong>.</p><p>Please enter this code to verify your account.</p>`,
    };
    transporter.sendMail(template, (error, info) => {
      if (error) {
        return next(ERROR(402, "Failed to send email"));
      }
      // console.log("email send successfully", info);
    });
  } catch (err) {
    next(err);
  }
};

module.exports = sendEMail;
