const app = require("../app");

async function connectDb() {
  try {
    await mongoose.connect("mongodb://ecom:ecom@localhost:27017/project");
    //await mongoose.connect("mongodb://localhost:27017/ecom2");

    console.log("project database connected");
  } catch (error) {
    console.log("Database Connection Error");
  }
}

connectDb();
