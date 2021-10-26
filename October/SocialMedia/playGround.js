let fs = require("fs");
let util = require("util");
var bcrypt = require("bcryptjs");
// fs.readFile("index.txt", "utf-8", function (err, data) {
//   console.log(data);
// });

function hashPassword(password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  });
}

module.exports = hashPassword;
hashPassword("123").then((data) => {
  console.log("password", data);
});
// readFilePromise("index.txt").then((data) => [console.log(data)]);
