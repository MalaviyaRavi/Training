const router = require("express").Router();
const {
  getStateAndCityByCurrentLocation,
  addCountry,
  addState,
  getStateByCountry,
} = require("../../controllers/api/address");

router.get(
  "/currentlocation/:latitude/:longitude",
  getStateAndCityByCurrentLocation
);

router.post("/countries", addCountry);

router.get("/states/:countrid", getStateByCountry);

router.post("/states", addState);

module.exports = router;
