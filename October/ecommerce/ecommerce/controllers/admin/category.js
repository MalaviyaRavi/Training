const categoryModel = require("../../models/Category");

exports.getAddCategory = function (req, res, next) {
  res.render("admin/product/add-category", { title: "Add Category" });
};

exports.postAddCategory = async function (req, res, next) {
  const { categoryname } = req.body;
  try {
    let categoryobj = await categoryModel.create({ categoryname });
    res.redirect("/admin/category/add");
  } catch (error) {
    next(error);
  }
};

exports.getDisaplyCategory = async function (req, res, next) {
  let categories = await categoryModel.find().lean();

  res.render("admin/product/display-category", {
    title: "Display Category",
    categories,
  });
};

exports.getEditCategory = async function (req, res, next) {
  try {
    const categoryObject = await categoryModel
      .findById(req.params.id)
      .select("categoryname")
      .lean();
    res.render("admin/product/edit-category", {
      title: "Edit Category",
      categoryname: categoryObject.categoryname,
    });
  } catch (error) {
    next(err);
  }
};

exports.postEditCategory = async function (req, res, next) {
  const { categoryname } = req.body;
  try {
    await categoryModel.findByIdAndUpdate(req.params.id, { categoryname });
    res.redirect("/admin/category/display");
  } catch (error) {
    next(error);
  }
};

exports.getDeleteCategory = async function (req, res, next) {
  try {
    await categoryModel.findByIdAndDelete(req.params.id);
    res.redirect("/admin/category/display");
  } catch (error) {
    next(error);
  }
};
