const cron = require('node-cron');
const CsvMetaData = require("../models/csvMetaData");
const mongoose = require("mongoose");
const csv = require('@fast-csv/parse');
const validateCsvData = require('../utility/csvUtil');
const User = require('../models/user');
async function connectDb() {
    try {
        await mongoose.connect(
            `mongodb://admin:admin@localhost:27017/api-task-database`
        );
        console.log("database connected");
    } catch (error) {
        console.log(error);
        console.log("database connection failed");
    }
}
// connectDb();
let task = cron.schedule('*/15 * * * * *', async function () {
    try {
        let fileMetadata = await CsvMetaData.findOne({
            status: {
                $ne: "uploaded"
            }
        }).lean();

        if (!fileMetadata) {
            console.log("no files pending");
        } else {

            if (fileMetadata.status === "pending") {
                io.emit("fileProcessStart", {
                    fileName: fileMetadata.Name
                })
            }

            await CsvMetaData.updateOne({
                _id: fileMetadata._id
            }, {
                $set: {
                    status: "inProgress"
                }
            })



            let rowsToBeUploaded = [];
            let batchSize = 2;
            let skipRows = fileMetadata.parsedRows;
            console.log("skipwors", skipRows, "fileid : *------------", fileMetadata._id);
            console.log("filePath", fileMetadata.filePath);
            csv.parseFile(fileMetadata.filePath, {
                    headers: headers => headers.map(function (value, index) {
                        return "field" + (index + 1);
                    }),
                    skipRows: skipRows,
                    maxRows: batchSize
                })
                .on('data', function (row) {
                    if (row) {
                        rowsToBeUploaded.push(row)
                    }
                })
                .on('end', async function (rowCount) {
                    if (rowCount) {
                        let validationResponse = await validateCsvData(rowsToBeUploaded, fileMetadata.FieldMapping, fileMetadata._id);
                        let users = await User.insertMany(validationResponse.validRecords)
                        await CsvMetaData.updateOne({
                            _id: fileMetadata._id
                        }, {
                            $inc: {
                                parsedRows: rowCount,
                                duplicateRecords: validationResponse.duplicateRecordsCount,
                                duplicateRecordsInCsv: validationResponse.duplicateCsvRecordsCount,
                                discardredRecords: validationResponse.discardredRecordsCount,
                                totalUploadedRecords: users.length
                            }
                        })
                        rowsToBeUploaded = [];
                        console.log("batch completet");
                        io.emit("statusChange");

                    } else {
                        await CsvMetaData.updateOne({
                            _id: fileMetadata._id
                        }, {
                            status: "uploaded"
                        })
                        io.emit("statusChange");
                        io.emit("fileProcessEnd", {
                            fileName: fileMetadata.Name
                        });
                    }
                });

        }
    } catch (error) {
        console.log(error);

    }
});

task.start();