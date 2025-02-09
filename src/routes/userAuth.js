const { login, register } = require("../controllers/clientAuth");
const { vote } = require("../controllers/votingController");
const express = require("express");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/vote", vote);

module.exports = router;
