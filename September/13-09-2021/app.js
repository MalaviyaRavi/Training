const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

var to;
var subject;
var body;
var path;

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./files");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: Storage,
}).single("file"); //Field name and max count

app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/public/contact-us.html");
});

app.post("/sendresume", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end("Error Occured!!");
    } else {
      to = req.body.to;
      subject = req.body.subject;
      body = req.body.subject;
      path = req.file.path;
      console.log(to);
      console.log(subject);
      console.log(body);
      console.log(req.file);
      console.log(req.files);
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ravi.malaviya.3795@gmail.com",
          pass: "ravi@3795",
        },
      });

      var mailOptions = {
        from: "rmalaviya.789@gmail.com",
        to: to,
        subject: subject,
        text: body,
        attachments: [
          {
            path: path,
          },
        ],
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email has been sent: " + info.response);
          fs.unlink(path, function (err) {
            if (err) {
              return res.end(err);
            } else {
              console.log("file deleted from server");
              return res.redirect("/response.html");
            }
          });
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log("App started on Port 3000");
});
