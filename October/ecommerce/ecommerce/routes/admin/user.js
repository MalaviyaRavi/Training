const router = require("express").Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/admin/users");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const {
  getAddUser,
  postAdduser,
  getDisplayUser,
  getEditUser,
  postEditUser,
  getDeleteUser,
} = require("../../controllers/admin/user");

router.get("/add", getAddUser);
router.post("/add", upload.single("userphoto"), postAdduser);

router.get("/display", getDisplayUser);

router.get("/edit/:id", getEditUser);
router.post("/edit/:id", upload.single("userphoto"), postEditUser);

router.get("/delete/:id", getDeleteUser);

module.exports = router;
