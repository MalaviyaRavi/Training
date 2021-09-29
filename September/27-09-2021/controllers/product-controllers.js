const Category = require("../models/Category");

exports.getAllCategory = function (req, res, next) {
  Category.find({})
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => {
      next(err);
    });
};
