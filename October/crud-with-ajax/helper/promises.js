const converter = require("json-2-csv");

function jsonToCsv(input) {
  return new Promise(function (resolve, reject) {
    converter.csv2json(input, function (err, csv) {
      if (err) {
        reject(err);
      } else {
        resolve(csv);
      }
    });
  });
}

module.exports = jsonToCsv;
