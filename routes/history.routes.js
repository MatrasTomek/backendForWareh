const express = require("express");

const router = express.Router();

const historyController = require("../controllers/history.controller");

router.get("/:abonamId.:magId", historyController.getHistoryElementById);
router.post("/add", historyController.postHistoryElement);

module.exports = router;
