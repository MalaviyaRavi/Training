const { default: axios } = require("axios");

//models
const countryModel = require("../../models/country");
const stateModel = require("../../models/state");
const cityModel = require("../../models/city");

exports.getStateAndCityByCurrentLocation = async function (req, res, next) {
  let { latitude, longitude } = req.params;

  try {
    let response = await axios.get(
      "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
        latitude +
        "&longitude=" +
        longitude +
        "&localityLanguage=en"
    );

    console.log(response);

    let countryname = response.data.countryName.toLowerCase();
    let statename = response.data.principalSubdivision.toLowerCase();
    let cityname = response.data.locality.split(" ")[0].toLowerCase();

    let country = await countryModel
      .findOne({ countryname })
      .populate("_states");
    let state = await stateModel.findOne({ statename }).populate("_cities");
    let city = await cityModel.findOne({ cityname });

    console.log(country, state, city);

    res.json({ country, state, city });
  } catch (error) {
    console.log(error);
  }
};

exports.addCountry = async function (req, res, next) {
  let countryName = req.body.countryname;
  countryName = countryName.toLowerCase();
  try {
    let country = await countryModel.create({ countryname: countryName });
    console.log("country created");
    res.json(country);
  } catch (error) {
    console.log(error);
  }
};

exports.addState = async function (req, res, next) {
  let { stateName, countryId } = req.body;
  stateName = stateName.toLowerCase();
  try {
    let state = await stateModel.create({ statename: stateName });
    await countryModel.findByIdAndUpdate(
      countryId,
      { $push: { _states: state._id } },
      { safe: true, upsert: true }
    );
    res.json(state);
  } catch (error) {
    console.log(error);
  }
};

exports.addCity = async function (req, res, next) {
  let { cityName, stateId } = req.body;
  cityName = cityName.toLowerCase();
  try {
    let city = await cityModel.create({ cityname: cityName });
    await stateModel.findByIdAndUpdate(
      stateId,
      { $push: { _cities: city._id } },
      { safe: true, upsert: true }
    );
    res.json(city);
  } catch (error) {
    console.log(error);
  }
};

exports.getStateByCountry = async function (req, res, next) {
  let countryId = req.params.countrid;
  try {
    let country = await countryModel
      .findOne({ _id: countryId })
      .populate("_states");
    let states = country._states;
    res.json({ states });
  } catch (error) {
    console.log(error);
  }
};

exports.getCityByState = async function (req, res, next) {
  let stateId = req.params.stateid;
  try {
    let state = await stateModel.findOne({ _id: stateId }).populate("_cities");
    let cities = state._cities;
    res.json({ cities });
  } catch (error) {
    console.log(error);
  }
};
