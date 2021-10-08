const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "MR";
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.get("/", function (req, res, next) {
  res.render("index");
});

router.post("/", upload.single("image"), function (req, res, next) {
  console.log(JSON.stringify(req.file));
  res.end();
});

router.get("/multiple", function (req, res, next) {
  res.render("multiple");
});

router.post("/multiple", upload.array("images", 3), function (req, res, next) {
  console.log(JSON.stringify(req.files));
  res.end();
});

module.exports = router;
