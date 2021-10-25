const router = require("express").Router();
const { registerUser, checkEmail } = require("../../controllers/api/users");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("profile"), registerUser);

router.get("/checkemail", checkEmail);

module.exports = router;
