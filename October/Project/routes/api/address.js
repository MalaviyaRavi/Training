const router = require("express").Router();
const {
  getStateAndCityByCurrentLocation,
  addCountry,
  addState,
  getStateByCountry,
  addCity,
  getCityByState
} = require("../../controllers/api/address");

router.get(
  "/currentlocation/:latitude/:longitude",
  getStateAndCityByCurrentLocation
);

router.post("/countries", addCountry);

router.post("/states", addState);

router.post("/cities", addCity);

router.get("/cities/:stateid", getCityByState)

router.get("/states/:countrid", getStateByCountry);



module.exports = router;
