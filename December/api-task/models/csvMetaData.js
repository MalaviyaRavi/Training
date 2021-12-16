const mongoose = require("mongoose");

const csvMetadataSchema = mongoose.Schema({
    Name: String,
    FieldMapping: {
        type: mongoose.Schema.Types.Mixed
    },
    totalRecords: Number,
    duplicateRecords: Number,
    discardredRecords: Number,
    totalUploadedRecords: Number,
    uploadBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        default: "pending"
    }
})


module.exports = mongoose.model("csvmetadata", csvMetadataSchema);