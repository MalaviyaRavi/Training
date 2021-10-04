var express = require("express");
var router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const { getIndex, getBbySearch } = require("../controllers/index-controller");
const {
  getForgotPassword,
  postForgotPassword,
  getForgotPasswordForm,
  postForgotPasswordForm,
} = require("../controllers/user-controller");
const isAuth = require("../middlewares/isAuth");

/* GET home page. */
router.get("/", getIndex);

router.get("/category", (req, res, next) => {
  Category.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/forgot-password", getForgotPassword);
router.post("/forgot-password", postForgotPassword);

router.get("/forgot-password/:userid/:token", getForgotPasswordForm);
router.post("/forgot-password/:userid/:token", postForgotPasswordForm);

router.get("/about", function (req, res, next) {
  res.render("pages/about", { title: "About Us" });
});

router.get("/contact", function (req, res, next) {
  res.render("pages/contact", { title: "Contact Us" });
});

router.post("/search", getBbySearch);
module.exports = router;
