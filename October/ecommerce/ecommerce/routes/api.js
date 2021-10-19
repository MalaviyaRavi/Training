const router = require("express").Router();
const {
  postSubcategoryByCategoryId,
  postCityByState,
  postAreaByCity,
} = require("../controllers/api");

router.post("/get-subcategory-by-category", postSubcategoryByCategoryId);

router.post("/get-city-by-state", postCityByState);

router.post("/get-area-by-city", postAreaByCity);

module.exports = router;
