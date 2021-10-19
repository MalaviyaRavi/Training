const subcategoryModel = require("../models/Subcategory");

const mongoose = require("mongoose");
const State = require("../models/State");
const City = require("../models/City");

exports.postSubcategoryByCategoryId = async function (req, res, next) {
  const { categoryname } = req.body;

  try {
    const allsubcategories = await subcategoryModel
      .find({})
      .populate("_category");
    specific_subcategory = allsubcategories.filter(function (doc) {
      return doc._category.categoryname == categoryname;
    });
    res.json(specific_subcategory);
  } catch (error) {
    next(error);
  }
};

exports.postCityByState = async function (req, res, next) {
  const { statename } = req.body;
  try {
    let state = await State.findOne({ statename }).populate("_cities");

    res.json(state._cities);
  } catch (error) {
    next(error);
  }
};

exports.postAreaByCity = async function (req, res, next) {
  const { cityid } = req.body;
  try {
    let city = await City.findOne({ _id: cityid }).populate("_areas");
    console.log(city._areas);
    res.json(city._areas);
  } catch (error) {
    next(error);
  }
};
