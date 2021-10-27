const mongoose = require("mongoose");

let personSchema = mongoose.Schema({
  name: String,
  contact_number: String,
  address: String,
});

const Person = mongoose.model("person", personSchema);

// let name = "mrm";
// let contact_number = "373737373737";
// let address = " address3";

// Person.create({ name, contact_number, address }).then((user) => {
//   console.log(user);
// });

module.exports = Person;
