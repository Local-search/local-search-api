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


module.exports = sendEmail