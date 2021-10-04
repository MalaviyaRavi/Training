const Product = require("../models/Product");
const Category = require("../models/Category");

exports.getIndex = function (req, res, next) {
  let isLogin = false;

  if (req.session.userid) {
    isLogin = true;
  }

  // let perPage = 3;
  // let currentpage = req.query.page;
  // console.log(currentpage);

  // if (currentpage == undefined) {
  //   perPage = 0;
  // }

  if (req.query.search) {
    let query = req.query.search;
    console.log("Query" + query);
    Product.find({ product_name: { $regex: query, $options: "i" } })

      // .skip(perPage * currentpage - perPage)
      //.limit(perPage)

      .lean()
      .then((products) => {
        let productsCount = products.length;
        // let pages = Math.ceil(productsCount / perPage);
        // let hasPagination = pages > 0 ? true : false;

        if (products.length != 0) {
          return res.render("pages/index", {
            title: "Home",
            products: products,
            // current: currentpage,
            // pages: pages,
            // hasPagination: hasPagination,
            isLogin,
          });
        }
        res.redirect("/");
      })
      .catch((err) => {
        next(err);
      });
  }

  Product.find()

    //.skip(perPage * currentpage - perPage)
    // .limit(perPage)
    .lean()
    .then((products) => {
      // let productsCount = products.length;
      // let pages = Math.ceil(productsCount / perPage);
      // let hasPagination = pages > 0 ? true : false;
      // console.log(hasPagination);
      res.render("pages/index", {
        title: "Home",
        products: products,
        // current: currentpage,
        // pages: pages,
        // hasPagination: hasPagination,
        isLogin,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getBbySearch = function (req, res, next) {
  let searchText = req.body.search;
  res.redirect("/?search=" + searchText);
};
