const express = require("express");
const cors = require("cors");
const transactionController = require("../controllers/transaction.controller");

const router = express.Router();

router.use(cors({ origin: "*" }));

router.get("/:podId", cors(), transactionController.getAllTransactionsForOneCompany);
router.get("/user/:id", cors(), transactionController.getAllTransactionsForOneUers);
router.post("/add", cors(), transactionController.rechargeCompanyAccount);
router.put("/", cors(), transactionController.updateTransactionWhenUserPaid);
router.use((request, response) => response.status(404).end());

module.exports = router;
