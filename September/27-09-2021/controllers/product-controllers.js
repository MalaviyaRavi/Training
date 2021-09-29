const Category = require("../models/Category");
const Product = require("../models/Product");
exports.getAllCategory = function (req, res, next) {
  Category.find({})
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getProducts = function (req, res, next) {
  const categoryid = req.query.category;
  console.log(categoryid);
  if (!categoryid) {
    Product.find()
      .populate("product_category")
      .lean()
      .then((products) => {
        console.log(products);
        let numOfProducts = products.length;
        console.log(numOfProducts);

        res.render("products/products", {
          products: products,
          numOfProducts: numOfProducts,
          numOfProject: products.length,
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    Product.find({ product_category: categoryid })
      .populate("product_category")
      .lean()
      .then((products) => {
        console.log(products);
        let numOfProducts = products.length;
        console.log(numOfProducts);

        res.render("products/products", {
          products: products,
          numOfProducts: numOfProducts,
          numOfProject: products.length,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
};
