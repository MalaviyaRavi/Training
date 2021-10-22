const countryModel = require("../models/country");

exports.getSignup = async function (req, res, next) {
  try {
    let countries = await countryModel.find().lean();
    console.log(countries);
    res.render("signup", { layout: "login", countries });
  } catch (error) {
    next(error);
  }
};
