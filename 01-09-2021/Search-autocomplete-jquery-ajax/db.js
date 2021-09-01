const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/search", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("Mongodb database connected successfully");
  })
  .catch((error) => {
    console.log("ERROR!!!, Mongodb database connection Failed", error.message);
  });
