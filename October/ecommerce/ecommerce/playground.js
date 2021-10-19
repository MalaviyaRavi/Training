var bcrypt = require("bcryptjs");
bcrypt.genSalt(10, function (err, salt) {
  bcrypt.hash("admin", salt, function (err, hash) {
    console.log(hash);
  });
});
