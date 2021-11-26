const mongoose = require("mongoose");

const configurationSchema = mongoose.Schema({
  configuration: {
    type: mongoose.Schema.Types.Mixed,
  },
});
const configurationModel = mongoose.model("configuration", configurationSchema);
module.exports = configurationModel;

// configurationModel.create({
//   "configuration.cronConfiguration.cronStatus": true,
// });
