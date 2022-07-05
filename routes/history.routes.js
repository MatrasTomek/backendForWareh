const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }));
const historyController = require("../controllers/history.controller");

router.get(
	"/:abonamId.:magId",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	historyController.getHistoryElementById,
);
router.post(
	"/add",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	historyController.postHistoryElement,
);
// router.put("/", cors(), detailsController.editWarehDetails);
// router.delete("/:id", cors(), detailsController.deleteWarehDetails);

module.exports = router;
