const City = require("../../models/City");
const Area = require("../../models/Area");

exports.getAddArea = async function (req, res, next) {
  let cities = await City.find().lean();
  res.render("admin/area/add-area", { cities });
};

exports.postAddArea = async function (req, res, next) {
  const { areaname, cityid } = req.body;
  console.log(req.body);

  try {
    const area = await Area.create({ areaname });
    const areaid = area._id;

    await City.findByIdAndUpdate(
      cityid,
      { $push: { _areas: areaid } },
      { safe: true, upsert: true }
    );
    res.redirect("/admin/area/add");
  } catch (error) {
    next(error);
  }
};

exports.getDisplayArea = async function (req, res, next) {
  let areas = await Area.find().lean();
  res.render("admin/area/display-area", { areas });
};

exports.getEditArea = async function (req, res, next) {
  const area = await Area.findById(req.params.id).lean();

  res.render("admin/area/edit-area", { areaname: area.areaname });
};

exports.postEditArea = async function (req, res, next) {
  let { areaname } = req.body;
  await Area.findByIdAndUpdate(req.params.id, { areaname });
  res.redirect("/admin/area/display");
};

exports.getDeleteArea = async function (req, res, next) {
  await Area.findByIdAndDelete(req.params.id);
  res.redirect("/admin/area/display");
};
