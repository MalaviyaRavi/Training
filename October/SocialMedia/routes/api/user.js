const router = require("express").Router();
const { checkExistance, sendOtp } = require("../../controllers/api/user");

router.get("/check", checkExistance);

router.get("/sendotp", sendOtp);

module.exports = router;
