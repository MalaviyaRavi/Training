const categoryModel = require("../../models/Category");
const subcategoryModel = require("../../models/Subcategory");

exports.getAddSubcategory = async function (req, res, next) {
  try {
    const categories = await categoryModel.find().select("categoryname").lean();
    res.render("admin/product/add-subcategory", {
      title: "Add Subcategory",
      categories,
    });
  } catch (error) {
    next(err);
  }
};

exports.postAddSubcategory = async function (req, res, next) {
  const { subcategoryname, _category } = req.body;
  try {
    await subcategoryModel.create({ subcategoryname, _category });
    res.redirect("/admin/subcategory/add");
  } catch (error) {
    next(error);
  }
};

exports.getDisplaySubcategory = async function (req, res, next) {
  let subcategories = await subcategoryModel
    .find()
    .populate("_category")
    .lean();

  res.render("admin/product/display-subcategory", {
    title: "Subcategories",
    subcategories,
  });
};

exports.getEditSubcategory = async function (req, res, next) {
  try {
    const subcategoryObject = await subcategoryModel
      .findById(req.params.id)
      .select("subcategoryname")
      .lean();
    let categories = await categoryModel.find().lean();
    res.render("admin/product/edit-subcategory", {
      title: "Edit Category",
      subcategoryname: subcategoryObject.subcategoryname,
      categories,
    });
  } catch (error) {
    next(err);
  }
};

exports.postEditSubcategory = async function (req, res, next) {
  // const { subcategoryname, _category } = req.body;
  try {
    await subcategoryModel.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    res.redirect("/admin/subcategory/display");
  } catch (error) {
    next(error);
  }
};

exports.getDeleteSubcategory = async function (req, res, next) {
  try {
    await subcategoryModel.findByIdAndDelete(req.params.id);
    res.redirect("/admin/subcategory/display");
  } catch (error) {
    next(error);
  }
};
