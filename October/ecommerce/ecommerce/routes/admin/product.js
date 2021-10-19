const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/admin/product-images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = require("express").Router();
const {
  getAddProduct,
  getDisplayProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  getDeleteProduct,
} = require("../../controllers/admin/product");

router.get("/add", getAddProduct);
router.post("/add", upload.single("productimage"), postAddProduct);

router.get("/display", getDisplayProduct);

router.get("/edit/:id", getEditProduct);
router.post("/edit/:id", upload.single("productimage"), postEditProduct);

router.get("/delete/:id", getDeleteProduct);

module.exports = router;
