const express = require("express");
const { getLogin, getUsers } = require("../controllers/users");
const router = express.Router();

/* GET users listing. */
router.get("/", getLogin);

router.get("/users", getUsers);

module.exports = router;
