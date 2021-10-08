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
