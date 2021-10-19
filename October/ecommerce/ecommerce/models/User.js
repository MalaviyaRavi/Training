const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  useremail: String,
  userpassword: String,

  usergender: {
    type: String,
  },
  userphoto: {
    type: String,
    default: "admin.png",
  },

  useradress: {
    type: String,
  },

  userrole: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  _area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "area",
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("user", userSchema);

// async function createAdmin() {
//   try {
//     await User.create({
//       username: "admin",
//       userpassword:
//         "$2a$10$nY4YZDh1zHnQy3TkDxnoteyj/xNNTc714YgRJLO.EjpHTCkDOF6nW",
//       useremail: "admin@gmail.com",
//       usergender: "male",
//       userrole: "admin",
//     });
//     console.log("Admin Created");
//   } catch (error) {
//     console.log(error);
//   }
// }
// createAdmin();

module.exports = mongoose.model("user", userSchema);
