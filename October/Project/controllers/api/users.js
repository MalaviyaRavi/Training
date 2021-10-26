const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const countryModel = require("../../models/country");
const userModel = require("../../models/user");

exports.registerUser = async function (req, res, next) {
  try {
    let profile = req.file.filename;
    let {
      username,
      password,
      email,
      gender,
      mobile,
      address,
      _city,
      _state,
      _country,
    } = req.body;
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        let user = await userModel.create({
          password: hash,
          username,
          email,
          gender,
          mobile,
          address,
          _city,
          _state,
          _country,
          profile,
        });
        res.send({
          success: true,
          data: { user, successMsg: "user register successfully" },
        });
      });
    });
  } catch (error) {
    res.send({ success: false, data: "something went wrong" });
  }
};

exports.checkEmail = async function (req, res, next) {
  let email = req.query.email;

  try {
    let user = await userModel.findOne({ email });
    if (user) {
      return res.send(false);
    }

    return res.send(true);
  } catch (error) {
    console.log(error);
  }
};
