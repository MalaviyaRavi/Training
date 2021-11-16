const express = require("express");

const path = require("path");
const multer = require("multer");

//storage file
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

const {
  saveUser,
  deleteUser,
  getUserById,
  getUsersByQuery,
  getUserDetailsById,
} = require("../../controllers/api/users");

//save and update user route
router.post("/", upload.single("image"), saveUser);

//delete user by id route
router.delete("/:id", deleteUser);

router.get("/", getUsersByQuery);

router.get("/user/:id", getUserDetailsById);

//get user by id route
router.get("/:id", getUserById);

module.exports = router;
