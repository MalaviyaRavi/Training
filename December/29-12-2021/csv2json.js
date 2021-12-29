const csv = require('csvtojson')
const fs = require("fs");

async function convertCsvToJson(csvFilePath) {
    // let csvRows = await csv({
    //     noheader: true
    // }).fromFile(csvFilePath);

    let csvRows = await csv().fromFile(csvFilePath);

    let users = JSON.stringify(csvRows, null, 2);
    fs.writeFileSync("users.json", users);
}


let csvFilePath = './users.csv';

convertCsvToJson(csvFilePath);