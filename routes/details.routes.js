const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }));
const detailsController = require("../controllers/details.controller");

router.get(
	"/:id",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	detailsController.getDetailsById,
);
router.get(
	"/",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	detailsController.getAllDetails,
);
router.post(
	"/add",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	detailsController.addDetailsToWareh,
);
router.put(
	"/",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	detailsController.editWarehDetails,
);
router.delete(
	"/:id",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	detailsController.deleteWarehDetails,
);

module.exports = router;
