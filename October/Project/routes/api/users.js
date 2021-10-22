const router = require("express").Router();
const { registerUser } = require("../../controllers/api/users");

router.post("/", registerUser);

module.exports = router;
