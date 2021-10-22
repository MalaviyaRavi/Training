const { default: axios } = require("axios");

//models
const countryModel = require("../../models/country");
const stateModel = require("../../models/state");

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

    let countryname = response.data.countryName;
    let statename = response.data.principalSubdivision;
    let cityname = response.data.locality.split(" ")[0];

    res.json({ countryname, statename, cityname });
  } catch (error) {
    console.log(error);
  }
};

exports.addCountry = async function (req, res, next) {
  let countryName = req.body.countryname;
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
