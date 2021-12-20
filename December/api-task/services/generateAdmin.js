const User = require("../models/user");

async function createAdmin() {

  let AllDbFields = Object.keys(User.schema.paths);
  let fieldsToBeIgnore = ["_id", "password", "__v", "addedBy"];
  let dbFieldsForCsv = AllDbFields.filter(function (field) {
    return !fieldsToBeIgnore.includes(field);
  })

  console.log(dbFieldsForCsv);



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