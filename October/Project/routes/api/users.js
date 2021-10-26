const router = require("express").Router();
const { registerUser, checkEmail } = require("../../controllers/api/users");

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "img",
      "userimages"
    );

    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const multerObject = multer({
  storage: storage,
});

const upload = multer(multerObject);

router.post("/", upload.single("profile"), registerUser);

router.get("/checkemail", checkEmail);

module.exports = router;
