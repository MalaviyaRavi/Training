const nodemailer = require("nodemailer");

const sendEmail = async function (email, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ravi.malaviya.3795@gmail.com",
        pass: "ravi@3795",
      },
    });

    await transporter.sendMail({
      from: "Forgot Password Link",
      to: email,
      subject: subject,
      text: text,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
