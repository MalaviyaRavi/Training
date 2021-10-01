var express = require("express");
const { render } = require("../app");
var router = express.Router();
const Admin = require("../models/Admin");
const Category = require("../models/Category");
const path = require("path");
const Product = require("../models/Product");
const mongoose = require("mongoose");
/* GET home page. */
router.get("/", function (req, res, next) {
  let isLogin = false;
  if (req.session.adminid) {
    isLogin = true;
  }
  if (!req.session.adminid) {
    return res.render("index", { isLogin: isLogin, title: "Admin Dashboard" });
  } else {
    res.redirect("/dashboard");
  }
});

router.post("/", (req, res, next) => {
  let { username, password } = req.body;
  Admin.findOne({ username: username })
    .then((admin) => {
      if (!admin) {
        return res.render("index", {
          isError: true,
          error: "username or password invalid",
        });
      }
      if (password != admin.password) {
        return res.render("index", {
          isError: true,
          error: "username or password invalid",
        });
      }
      //console.log(admin._id);
      //console.log(admin.id);
      req.session.adminid = admin.id;
      res.redirect("/dashboard");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/dashboard", function (req, res, next) {
  let isLogin = false;
  if (req.session.adminid) {
    isLogin = true;
  }

  if (req.session.adminid) {
    if (req.query.search) {
      let query = req.query.search;
      console.log("Query" + query);
      Product.find({ product_name: { $regex: query, $options: "i" } })

        .lean()
        .then((products) => {
          let numofProduct = products.length;
          let numofpages = Math.floor(numofProduct / 2);
          let pages = Array.from(Array(numofpages + 1).keys());
          console.log(pages);

          if (products.length != 0) {
            return res.render("dashboard", {
              products: products,
              isLogin: isLogin,
              title: "Admin Dashboard",
              numofProduct: numofProduct,
              pages: pages,
            });
          }
          res.redirect("/dashboard");
        })
        .catch((err) => {
          next(err);
        });
    } else if (req.query.category) {
      const categoryid = req.query.category;

      Product.find({ product_category: categoryid })
        .populate("product_category")
        .lean()
        .then((products) => {
          let numofProduct = products.length;

          let numofpages = Math.floor(numofProduct / 2);
          let pages = Array.from(Array(numofpages + 1).keys());

          console.log(pages);
          res.render("dashboard", {
            products: products,
            isLogin: isLogin,
            title: "Admin Dashboard",
            numofProduct: numofProduct,
            pages: pages,
          });
        })
        .catch((err) => {
          next(err);
        });
    } else {
      Product.find()
        .populate("product_category")
        .lean()
        .then((products) => {
          let numofProduct = products.length;
          let numofpages = Math.floor(numofProduct / 2);
          let pages = Array.from(Array(numofpages + 1).keys());
          console.log(pages);

          console.log(pages.length);
          res.render("dashboard", {
            products: products,
            isLogin: isLogin,
            title: "Admin Dashboard",
            numofProduct: numofProduct,
            pages: pages,
          });
        })
        .catch((err) => {
          next(err);
        });
    }
  } else {
    res.redirect("/");
  }
});

router.get("/add-product", (req, res, next) => {
  let isLogin = false;
  if (req.session.adminid) {
    isLogin = true;
  }

  if (req.session.adminid) {
    return res.render("add_product", {
      isLogin: isLogin,
      title: "Add Product",
    });
  }
  res.redirect("/");
});

router.post("/add-product", (req, res, next) => {
  let { product_name, product_detail, product_price, product_qty, category } =
    req.body;
  let fileobj = req.files.image;
  let filename = fileobj.name;
  //console.log(filename);
  //console.log(fileobj);
  let uploadPath = path.join(__dirname, "../public/products/", filename);
  console.log(uploadPath);
  let uploadPath2 =
    "/home/webcodegenie/Documents/Training/September/Project/ecom/public/products/" +
    fileobj.name;

  fileobj.mv(uploadPath, (err) => {
    if (err) {
      return next(err);
    }

    fileobj.mv(uploadPath2, function (err) {
      if (err) {
        return next(err);
      }
      Product.create({
        product_name,
        product_detail,
        product_price,
        product_qty,
        product_image: filename,
        product_category: category,
      })
        .then((product) => {
          res.redirect("/dashboard");
        })
        .catch((err) => {
          next(err);
        });
    });
  });
});

router.post("/add-category", (req, res, next) => {
  if (req.session.adminid) {
    Category.create({ category_name: req.body.category_name })
      .then(() => {
        res.redirect("/dashboard");
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.redirect("/");
  }
});

router.get("/add-category", (req, res, next) => {
  let isLogin = false;
  if (req.session.adminid) {
    isLogin = true;
  }
  if (req.session.adminid) {
    return res.render("add_category", {
      isLogin: isLogin,
      title: "Add Category",
    });
  }
  res.redirect("/");
});

router.get("/category", (req, res, next) => {
  if (req.session.adminid) {
    Category.find()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.redirect("/");
  }
});

router.get("/edit-product/:id", (req, res, next) => {
  let isLogin = false;
  if (req.session.adminid) {
    isLogin = true;
  }
  if (req.session.adminid) {
    let productid = req.params.id;
    return Product.findOne({ _id: productid })
      .lean()
      .populate("product_category")
      .then((product) => {
        console.log(product);
        res.render("edit_product", {
          product: product,
          isLogin: isLogin,
          title: "Edit Product",
        });
      })
      .catch((err) => next(err));
  }
  res.redirect("/");
});

router.post("/edit-product/:id", (req, res, next) => {
  let productid = req.params.id;
  let { product_name, product_detail, product_price, product_qty } = req.body;
  if (req.files) {
    var fileobj = req.files.image;

    let uploadPath = path.join(__dirname, "../public/products/", fileobj.name);
    let uploadPath2 =
      "/home/webcodegenie/Documents/Training/September/Project/ecom/public/products/" +
      fileobj.name;

    fileobj.mv(uploadPath, function (err) {
      if (err) {
        return next(err);
      }
      fileobj.mv(uploadPath2, function (err) {
        if (err) {
          return next(err);
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
            res.redirect("/dashboard");
          })
          .catch(() => {
            next(err);
          });
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
        res.redirect("/dashboard");
      })
      .catch(() => {
        next(err);
      });
  }
});

router.get("/delete-product/:id", (req, res, next) => {
  let productid = req.params.id;
  Product.findByIdAndDelete(productid)
    .then((deleted_product) => {
      return res.redirect("/dashboard");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post("/search", (req, res, next) => {
  let isLogin = false;
  if (req.session.adminid) {
    isLogin = true;
  }
  if (req.session.adminid) {
    let searchText = req.body.search;
    res.redirect("/dashboard?search=" + searchText);
  } else {
    res.redirect("/");
  }
});

module.exports = router;
