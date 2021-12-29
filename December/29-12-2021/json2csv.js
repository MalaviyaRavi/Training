let converter = require('json-2-csv');
const fs = require('fs')

function convertJsonToCsv(jsonFilePath) {
    // let csvRows = await csv({
    //     noheader: true
    // }).fromFile(csvFilePath);
    let jsonData = fs.readFileSync(jsonFilePath);
    let users = JSON.parse(jsonData);
    converter.json2csv(users, function (err, csv) {
        fs.writeFileSync("users2.csv", csv);
    })
}

convertJsonToCsv("./users.json");