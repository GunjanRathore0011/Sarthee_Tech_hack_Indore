const express = require("express");
const router = express.Router();
const { askBot } = require("../controller/telegramController");

router.post("/ask", askBot);

module.exports = router;
