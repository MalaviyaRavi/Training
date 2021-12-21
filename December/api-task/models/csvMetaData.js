const mongoose = require("mongoose");

const csvMetadataSchema = mongoose.Schema({
    Name: String,
    FieldMapping: {
        type: mongoose.Schema.Types.Mixed
    },
    totalRecords: Number,
    filePath: String,
    parsedRows: {
        type: Number,
        default: 0
    },
    skipRow: {
        type: Boolean,
        default: false
    },
    duplicateRecords: {
        type: Number,
        default: 0
    },
    duplicateRecordsInCsv: {
        type: Number,
        default: 0
    },
    discardredRecords: {
        type: Number,
        default: 0
    },
    totalUploadedRecords: {
        type: Number,
        default: 0
    },
    uploadBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        default: "pending"
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("csvmetadata", csvMetadataSchema);