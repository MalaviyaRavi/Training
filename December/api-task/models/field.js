const mongoose = require("mongoose");

const fieldSchema = mongoose.Schema({
    fields: []
})

module.exports = mongoose.model("field", fieldSchema);