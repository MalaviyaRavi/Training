const express = require("express");
const {
  body,
  validationResult
} = require("express-validator");
const {
  login,
  getAllUsers,
  checkExistance,
  addUser,
  logout,
  uploadCsv,
  createFileMetadata,
  addNewField,
  getFiles,
  deleteFile
} = require("../../controllers/api/users");

const path = require("path");

const multer = require("multer");

//storage file
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let uploadPath = path.join(__dirname, "..", "..", "public", "csvs");
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    let suffix = Date.now()
    callback(null, req.user.userEmail + suffix + ".csv");
  },
});

const multerObject = multer({
  storage: storage,
});

const upload = multer(multerObject);

const User = require("../../models/user");

const router = express.Router();

router.post("/login", login);

router.get("/users", isAuthenticated, getAllUsers);

router.get("/users/check", checkExistance);

router.post(
  "/upload/csv",
  isAuthenticated,
  upload.single("csvFile"),
  uploadCsv
);

router.post("/fieldMap", isAuthenticated, createFileMetadata);

router.post(
  "/users",
  isAuthenticated,
  body("name").notEmpty().withMessage("name is required"),
  body("password")
  .isLength({
    min: 6
  })
  .withMessage("password should be 6 character long"),
  body("email")
  .isEmail()
  .withMessage("enter valid email address")
  .custom(async function (value) {
    let user = await User.findOne({
      email: value
    });
    if (user) {
      throw new Error("email is already registered");
    }
  }),
  body("mobile")
  .isMobilePhone()
  .withMessage("enter valid mobile number")
  .custom(async function (value) {
    let user = await User.findOne({
      mobile: value
    });
    if (user) {
      throw new Error("mobile is already registered");
    }
  }),
  addUser
);

router.post("/field/add", addNewField);

router.get("/logout", logout);

router.get("/files", getFiles);


router.delete("/files/:fileId", deleteFile)

module.exports = router;