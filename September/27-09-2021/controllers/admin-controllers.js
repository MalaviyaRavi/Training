const path = require("path");
const Product = require("../models/Product");
const User = require("../models/User");

exports.getAddProduct = function (req, res, next) {
  res.render("products/add-product", { title: "Add-product" });
};

exports.postAddProduct = function (req, res, next) {
  var fileobj = req.files.productImg;

  let uploadPath;

  uploadPath = path.join(__dirname, "../public/products/", fileobj.name);

  fileobj.mv(uploadPath, function (err) {
    if (err) {
      return res.render("add-product", {
        isError: true,
        error: "Error in Product Picture Upload",
        title: "Add-Product",
      });
    }

    let { product_name, product_detail, product_price, product_qty } = req.body;
    let image_name = fileobj.name;

    Product.create({
      product_name,
      product_detail,
      product_price,
      product_qty,
      product_image: image_name,
    })
      .then((product) => {
        res.redirect("/");
      })
      .catch((err) => {
        next(err);
      });
  });
};
