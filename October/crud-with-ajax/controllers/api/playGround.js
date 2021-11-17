const { parse } = require("json2csv");

const fields = ["field1", "field2", "field3"];
const opts = { fields };

let myData = [
  { field2: "def", field3: "pwr", field1: "abc" },
  { field1: "abc", field2: "def", field3: "pwr" },
];

try {
  const csv = parse(myData, opts);
  console.log(csv);
} catch (err) {
  console.error(err);
}
