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

    let info = await transporter.sendMail({
      from: "Users CSV File",
      to: email,
      subject: subject,
      html: text,
    });

    return info;
  } catch (error) {
    throw error;
  }
};

// sendEmail("rmalaviya.789@gmail.com", "hello", "body");

module.exports = sendEmail;
