const router = require("express").Router();

const { getSignup } = require("../controllers/user");

router.get("/signup", getSignup);

module.exports = router;
