const express = require("express");
const subscriptionController = require("../controllers/subscription.controller");
const cors = require("cors");
const router = express.Router();
router.use(cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }));

router.get(
	"/:companyId",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	subscriptionController.getSubscriptionForOneCompany,
);
router.post(
	"/add",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	subscriptionController.postSubscription,
);
// router.put("/", cors(), companyController.putCompany);
router.delete(
	"/:id",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	subscriptionController.delSubscription,
);

router.use((request, response) => response.status(404).end());

module.exports = router;
