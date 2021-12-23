const User = require("../models/user");

async function createAdmin() {



  let user = await User.findOne({
    email: "admin@admin.com"
  });
  if (!user) {
    await User.create({
      name: "Admin",
      email: "admin@admin.com",
      mobile: "1234567890",
      password: bcrypt.hashSync("123456", 8),
    });
    console.log("admin user created");
  } else {
    console.log("admin user already exists");
  }
}
createAdmin();