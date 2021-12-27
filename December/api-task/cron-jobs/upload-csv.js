const cron = require('node-cron');
const CsvMetaData = require("../models/csvMetaData");
const csv = require('@fast-csv/parse');
const validateCsvData = require('../utility/csvUtil');
const User = require('../models/user');

module.exports = function (time) {
    let task = cron.schedule(time, async function () {

        try {
            let fileMetadata = await CsvMetaData.findOne({
                status: {
                    $ne: "uploaded"
                },
                FieldMapping: {
                    $ne: null
                }

            }).lean();

            if (!fileMetadata) {
                console.log("no files pending");
            } else {


                if (fileMetadata.status === "pending") {
                    publisher.publish("cronNotification", JSON.stringify({
                        message: "fileProcessStart",
                        fileName: fileMetadata.Name
                    }))
                    // io.emit("fileProcessStart", {
                    //     fileName: fileMetadata.Name
                    // })
                }
                await CsvMetaData.updateOne({
                    _id: fileMetadata._id
                }, {
                    $set: {
                        status: "inProgress"
                    }
                })
                let rowsToBeUploaded = [];
                let batchSize = 3;
                let skipRows = fileMetadata.parsedRows;
                csv.parseFile(fileMetadata.filePath, {
                        headers: headers => headers.map(function (value, index) {
                            return "field" + (index + 1);
                        }),
                        skipRows: skipRows,
                        maxRows: batchSize,
                        // renameHeaders: !fileMetadata.skipRows
                    })
                    .on('data', function (row) {
                        if (row) {
                            rowsToBeUploaded.push(row);
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
                            console.log("batch complete");
                            publisher.publish("cronNotification", JSON.stringify({
                                message: "statusChange",
                            }))

                        } else {
                            await CsvMetaData.updateOne({
                                _id: fileMetadata._id
                            }, {
                                status: "uploaded"
                            })
                            publisher.publish("cronNotification", JSON.stringify({
                                message: "statusChange",
                            }))
                            publisher.publish("cronNotification", JSON.stringify({
                                message: "fileProcessStart",
                                fileName: fileMetadata.Name
                            }))
                        }
                    });

            }
        } catch (error) {
            console.log(error);
        }
    }, {
        scheduled: false
    });
    task.start();



}

// io.on("connection", function (socket) {
//     console.log("connection establish");
//     socket.on("cronStart", function () {
//         console.log("cron start");
//         task.start();
//     })
//     socket.on("cronStop", function () {
//         console.log("cron stop");
//         task.stop();
//     })
// })