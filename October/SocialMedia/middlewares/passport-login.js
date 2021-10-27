const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const userModel = require("../models/user");

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      let user = await userModel.findOne({
        $or: [{ email: username }, { username: username }],
      });
      if (!user) {
        return done(null, false, {
          message: "email or password invalid!!",
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: "email or password invalid!!",
        });
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  })
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
