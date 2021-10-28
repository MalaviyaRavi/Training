const userModel = require("../../models/user");
const otpGenerator = require("otp-generator");
const sendEmail = require("../../services/mail-service");
//twilio config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

//two step varfication config
// const { Auth, LoginCredentials } = require("two-step-auth");
// LoginCredentials.mailID = "socialmedia3795@gmail.com";
// LoginCredentials.password = "socialmedia";

exports.checkExistance = async function (req, res, next) {
  try {
    let user = await userModel.findOne(req.query);
    if (user) {
      return res.send(false);
    }
    res.send(true);
  } catch (error) {
    console.log(error);
  }
};

exports.sendOtp = async function (req, res, next) {
  let userid = req.user._id;
  try {
    let { email, mobile } = await userModel
      .findOne({ _id: userid })
      .select("email mobile");
    let OTP = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    sendEmail(
      email,
      "Social Media App Varification",
      "this is your otp - " + OTP + " it is valid for 2 minutes"
    );

    await client.messages.create({
      body: "this is your OTP- " + OTP + " for varify social media account",
      from: "+12565681927",
      to: "+91" + mobile,
    });
    await userModel.updateOne(
      { email },
      { $set: { otp: OTP, otpGenratedAt: Date.now() } }
    );

    res.json({ success: true, successMsg: "otp sent to your mobile & email" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      errorMsg: "something went wrong to send OTP try again",
    });
  }
};
