const countryModel = require("../../models/country");
const userModel = require("../../models/user");

exports.registerUser = function (req, res, next) {
  console.log(req.body);
  console.log(req.file);
  res.json("Register User");
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
