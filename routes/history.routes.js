const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());
const historyController = require("../controllers/history.controller");

router.get("/:abonamId.:magId", cors(), historyController.getHistoryElementById);
router.post("/add", cors(), historyController.postHistoryElement);
// router.put("/", cors(), detailsController.editWarehDetails);
// router.delete("/:id", cors(), detailsController.deleteWarehDetails);

module.exports = router;
