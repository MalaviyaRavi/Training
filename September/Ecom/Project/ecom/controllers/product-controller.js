const Product = require("../models/Product");
const Category = require("../models/Category");

exports.getProductDetail = function (req, res, next) {
  Product.findById(req.params.id)
    .lean()
    .then((product) => {
      console.log(product);
      res.render("pages/product/product_detail", {
        product: product,
        title: product.product_name,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getByCategory = function (req, res, next) {
  const category = req.params.category;

  Category.findOne({ category_name: category })
    .then((categoryData) => {
      Product.find({ product_category: categoryData._id })

        .populate("product_category")
        .lean()

        .then((products) => {
          res.render("pages/index", {
            title: category,
            products: products,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => next(err));
};
