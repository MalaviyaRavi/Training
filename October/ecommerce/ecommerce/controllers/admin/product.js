const productModel = require("../../models/Product");
const subcategoryModel = require("../../models/Subcategory");
const categoryModel = require("../../models/Category");
exports.getAddProduct = async function (req, res, next) {
  try {
    let categories = await categoryModel.find().lean();

    res.render("admin/product/add-product", {
      title: "Add Product",
      categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.postAddProduct = async function (req, res, next) {
  let { productname, productdetail, productprice, _subcategory } = req.body;
  let productimage = req.file.originalname;
  // let productimages = filesObjectArray.map(function (item) {
  //   return item.originalname;
  // });

  try {
    await productModel.create({
      productname,
      productdetail,
      productprice,
      _subcategory,
      productimage,
    });

    res.redirect("/admin/product/display");
  } catch (error) {
    next(error);
  }
};

exports.getDisplayProduct = async function (req, res, next) {
  try {
    let products = await productModel.find().lean();
    res.render("admin/product/display-product", {
      title: "Products",
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getEditProduct = async function (req, res, next) {
  let id = req.params.id;
  try {
    let product = await productModel.findById(id).lean();
    let categories = await categoryModel.find().lean();
    res.render("admin/product/edit-product", { product, categories });
  } catch (error) {
    next(error);
  }
};

exports.postEditProduct = async function (req, res, next) {
  // let { productname, productdetail, productprice, _subcategory } = req.body;

  try {
    if (!req.file) {
      await productModel.findByIdAndUpdate(req.params.id, { ...req.body });
      return res.redirect("/admin/product/display");
    }
    let productimage = req.file.originalname;
    await productModel.findByIdAndUpdate(req.params.id, {
      ...req.body,
      productimage,
    });
    res.redirect("/admin/product/display");
  } catch (error) {
    next(error);
  }
};

exports.getDeleteProduct = async function (req, res, next) {
  let id = req.params.id;
  await productModel.findByIdAndDelete(id);
  res.redirect("/admin/product/display");
};
