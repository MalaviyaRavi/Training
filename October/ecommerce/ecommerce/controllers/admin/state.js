const State = require("../../models/State");

exports.getDisplayState = async function (req, res, next) {
  let states = await State.find().lean();
  res.render("admin/state/display-state", { states });
};

exports.getAddState = function (req, res, next) {
  res.render("admin/state/add-state");
};

exports.postAddState = async function (req, res, next) {
  const { statename } = req.body;
  try {
    await State.create({ statename });
    res.redirect("/admin/state/add");
  } catch (error) {
    next(error);
  }
};

exports.getEditState = async function (req, res, next) {
  let id = req.params.id;

  const state = await State.findById(id).lean();
  console.log(state);
  res.render("admin/state/edit-state", { statename: state.statename });
};

exports.postEditState = async function (req, res, next) {
  let { statename } = req.body;
  await State.findByIdAndUpdate(req.params.id, { statename });
  res.redirect("/admin/state/display");
};

exports.getDeleteState = async function (req, res, next) {
  await State.findByIdAndDelete(req.params.id);
  res.redirect("/admin/state/display");
};
