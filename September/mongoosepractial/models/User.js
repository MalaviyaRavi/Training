const mongoose = require("mongoose");
const Project = require("./Project");

const userSchema = mongoose.Schema({
  username: String,
  email: String,

  age: Number,
});

const User = mongoose.model("user2", userSchema);

// User.create({
//   username: "xyz",
//   email: "xyz@gmail.com",
//   age: 22,
// })
//   .then((user) => {
//     console.log("User Created" + user);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const userQuery = User.find();
// userQuery
//   .where("age")
//   .gt(18)
//   .then((users) => {
//     console.log(users);
//   })
//   .catch((err) => console.log(err));

// userQuery
//   .find()
//   .then((users) => {
//     Project.create({
//       createdBy: users[0]._id,
//       contributors: [users[0]._id, users[1]._id, users[2]._id],
//     })
//       .then((projects) => {
//         console.log(projects);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

Project.findOne({ _id: "615d3d40e4298b00ab3bc3bd" })
  .populate({
    path: "contributors",
    match: { email: "abc@gmail.com" },
    select: "username age",
  })
  .then((project) => {
    console.log(project);
  })
  .catch((err) => {
    console.log(err);
  });
