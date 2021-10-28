const nodemailer = require("nodemailer");

const sendEmail = async function (email, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "socialmedia3795@gmail.com",
        pass: "socialmedia",
      },
    });

    await transporter.sendMail({
      from: "OTP Varification For Social Media APP",
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
