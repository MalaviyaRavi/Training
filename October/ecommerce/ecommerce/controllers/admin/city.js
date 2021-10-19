const State = require("../../models/State");
const City = require("../../models/City");
exports.getAddCity = async function (req, res, next) {
  try {
    let states = await State.find().lean();
    res.render("admin/city/add-city", { states });
  } catch (error) {
    next(error);
  }
};

exports.postAddCity = async function (req, res, next) {
  const { cityname, stateid } = req.body;
  console.log(req.body);

  try {
    const city = await City.create({ cityname });
    const cityid = city._id;
    console.log(cityid);
    // const state = await State.findById(stateid);
    // console.log(state);
    await State.findByIdAndUpdate(
      stateid,
      { $push: { _cities: cityid } },
      { safe: true, upsert: true }
    );
    res.redirect("/admin/city/add");
  } catch (error) {
    next(error);
  }
};

exports.getDisplayCity = async function (req, res, next) {
  let cities = await City.find().lean();
  res.render("admin/city/display-city", { cities });
};

exports.getEditCity = async function (req, res, next) {
  const city = await City.findById(req.params.id).lean();

  res.render("admin/city/edit-city", { cityname: city.cityname });
};

exports.postEditCity = async function (req, res, next) {
  let { cityname } = req.body;
  await City.findByIdAndUpdate(req.params.id, { cityname });
  res.redirect("/admin/city/display");
};

exports.getDeleteCity = async function (req, res, next) {
  await City.findByIdAndDelete(req.params.id);
  res.redirect("/admin/city/display");
};
