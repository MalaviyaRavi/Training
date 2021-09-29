const mongoose = require("mongoose");
const path = require("path");
const Product = require("../models/Product");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

exports.getAdminLogin = function (req, res, next) {
  let isLogin = false;
  if (req.session.adminid) {
    isLogin = true;
  }
  res.render("admin-login", {
    title: "Login",
    isLogin: isLogin,
  });
};

exports.postAdminLogin = function (req, res, next) {
  let isLogin = false;

  if (req.session.adminid) {
    isLogin = true;
  }
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();
  if (!email || !password) {
    return res.render("admin-login", {
      title: "Login",
      error: "Please Fill Up All Fields",
      isError: true,
      isLogin: isLogin,
    });
  }

  Admin.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render("admin-login", {
          title: "Login",
          error: "Email Or Password Invalid",
          isError: true,
          isLogin: isLogin,
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          console.log(result);
          if (result != true) {
            return res.render("admin-login", {
              error: "Email Or Password Invalid",
              isError: true,
              isLogin: isLogin,
              title: "Login",
            });
          }

          req.session.adminid = user.id;
          res.redirect("/admin/products");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getProducts = function (req, res, next) {
  let isLogin = false;
  if (req.session.adminid) {
    isLogin = true;
  }

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

        res.render("products/admin-products", {
          products: products,
          numOfProducts: numOfProducts,
          numOfProject: products.length,
          isLogin: isLogin,
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

        res.render("products/admin-products", {
          products: products,
          numOfProducts: numOfProducts,
          numOfProject: products.length,
          isLogin: isLogin,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.getAddProduct = function (req, res, next) {
  res.render("products/add-product", {
    title: "Add-product",
    isLogin: isLogin,
  });
};

exports.postAddProduct = function (req, res, next) {
  var fileobj = req.files.productImg;
  console.log();

  let uploadPath;

  uploadPath = path.join(__dirname, "../public/products/", fileobj.name);

  fileobj.mv(uploadPath, function (err) {
    if (err) {
      return res.render("products/add-product", {
        isError: true,
        error: "Error in Product Picture Upload",
        title: "Add-Product",
        isLogin: isLogin,
      });
    }

    let { product_name, product_detail, product_price, product_qty, category } =
      req.body;
    let image_name = fileobj.name;

    console.log(req.body);

    Product.create({
      product_name,
      product_detail,
      product_price,
      product_qty,
      product_category: category,
      product_image: image_name,
    })
      .then((product) => {
        res.redirect("/admin/products");
      })
      .catch((err) => {
        next(err);
      });
  });
};

exports.deleteProduct = function (req, res, next) {
  let productid = req.params.id;
  Product.findByIdAndDelete(productid)
    .then((deleted_product) => {
      console.log(deleted_product);
      return res.redirect("/admin/products");
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEditProduct = function (req, res, next) {
  let productid = req.params.id;
  Product.findOne({ _id: productid })
    .lean()
    .then((product) => {
      console.log(product);
      res.render("products/edit-product", {
        product: product,
        isLogin: isLogin,
      });
    })
    .catch((err) => next(err));
};

exports.postEditProduct = function (req, res, next) {
  let productid = req.params.id;
  let { product_name, product_detail, product_price, product_qty } = req.body;
  if (req.files) {
    var fileobj = req.files.productImg;

    let uploadPath = path.join(__dirname, "../public/products/", fileobj.name);

    fileobj.mv(uploadPath, function (err) {
      if (err) {
        return res.render("products/edit-product", {
          isError: true,
          error: "Error in Product Picture Upload",
          title: "Edit-Product",
          isLogin: isLogin,
        });
      }
      let image_name = fileobj.name;
      Product.findByIdAndUpdate(productid, {
        product_name,
        product_detail,
        product_price,
        product_qty,
        product_image: image_name,
      })
        .then(() => {
          res.redirect("/admin/products");
        })
        .catch(() => {
          next(err);
        });
    });
  } else {
    Product.findByIdAndUpdate(productid, {
      product_name,
      product_detail,
      product_price,
      product_qty,
    })
      .then(() => {
        res.redirect("/admin/products");
      })
      .catch(() => {
        next(err);
      });
  }
};
