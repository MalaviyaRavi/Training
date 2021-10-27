const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//twilio config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

//two step varfication config
const { Auth, LoginCredentials } = require("two-step-auth");
LoginCredentials.mailID = "socialmedia3795@gmail.com";
LoginCredentials.password = "socialmedia";

const userModel = require("../models/user");

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },

    async function (req, username, password, done) {
      try {
        // let user = await userModel.findOne({ email: req.body.email });
        // if (!user) {
        //   return done(null, false, {
        //     message: "user is already registred! try login",
        //   });
        // }
        // const res = await Auth(req.body.email, "Social Media");
        // if (!res.success) {
        //   console.log("error in send OTP to mail");
        // }
        // let OTP = res.OTP;
        // let message = await client.messages.create({
        //   body: "this is your OTP- " + OTP + "for varify social media account",
        //   from: "+12565681927",
        //   to: "+91" + req.body.mobile,
        // });
        // if (message.status != "sent") {
        //   console.log("error in send OTP to mobile");
        // }

        let hashPassword = await userModel.encryptPassword(password);

        let { username, email, gender, mobile } = req.body;
        let newuser = await userModel.create({
          username,
          email,
          gender,
          mobile,
          password: hashPassword,
        });
        return done(null, newuser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  userModel
    .findById(id)
    .then((user) => cb(null, user))
    .catch((err) => cb(err));
});
