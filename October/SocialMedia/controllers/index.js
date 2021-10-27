exports.getIndex = function (req, res, next) {
  res.render("pages/index", { title: "Express" });
};
