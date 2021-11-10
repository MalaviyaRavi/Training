const express = require("express");

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let uploadPath = path.join(__dirname, "..", "..", "public", "img");

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
const router = express.Router();

const { signup, deleteUser } = require("../../controllers/api/users");

router.post("/", upload.single("image"), signup);

router.delete("/:id", deleteUser);

module.exports = router;
