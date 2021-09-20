var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
/* GET home page. */
router.get("/", function (req, res, next) {
  console.log();
  res.render("index", { title: "Sign Up" });
});

router.post("/", function (req, res, next) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ravi.malaviya.3795@gmail.com",
      pass: "ravi@3795",
    },
  });

  var mailOptions = {
    from: "ravi.malaviya.3795@gmail.com",
    to: "rmalaviya.789@gmail.com",
    subject: "Inquiry For Course",
    html: `<table border="1" cellpadding = "2">
    <tr><td>Name</td> <td> ${req.body.name} </td> </tr>
    <tr><td>Email</td> <td> ${req.body.email} </td> </tr>
    <tr><td>Password</td> <td> ${req.body.password} </td> </tr>
    <tr><td>Contact Number</td> <td> ${req.body.mobile} </td> </tr>
    <tr><td>Gender</td> <td> ${req.body.gender} </td> </tr>
  </table>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.render("index", {
        error: "Mail Server Is Busy Please Try Again Letter",
        isError: true,
      });
    } else {
      console.log("Email has been sent: " + info.response);
      res.render("index", {
        success: "Mail Sent Successfully",
        isSuccess: true,
      });
    }
  });
});
module.exports = router;
