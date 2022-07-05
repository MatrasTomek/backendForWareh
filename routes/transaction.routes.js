const express = require("express");
const cors = require("cors");
const transactionController = require("../controllers/transaction.controller");

const router = express.Router();

router.use(cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }));

router.get(
	"/:podId",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	transactionController.getAllTransactionsForOneCompany,
);
router.get(
	"/user/:id",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	transactionController.getAllTransactionsForOneUers,
);
router.post(
	"/add",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	transactionController.rechargeCompanyAccount,
);
router.put(
	"/",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	transactionController.updateTransactionWhenUserPaid,
);
router.use((request, response) => response.status(404).end());

module.exports = router;
