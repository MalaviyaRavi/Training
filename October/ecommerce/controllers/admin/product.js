const productModel = require("../../models/Product");
const subcategoryModel = require("../../models/Subcategory");
exports.getAddProduct = async function (req, res, next) {
  let subcategories = await subcategoryModel
    .find()
    .populate("_category")
    .res.render("admin/product/add-product", {
      title: "Add Product",
    });
};

exports.getDisplayProduct = function (req, res, next) {
  res.render("admin/product/display-product", { title: "Products" });
};
