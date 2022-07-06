const express = require("express");
const transactionController = require("../controllers/transaction.controller");
const router = express.Router();

router.get("/:podId", transactionController.getAllTransactionsForOneCompany);
router.get("/user/:id", transactionController.getAllTransactionsForOneUers);
router.post("/add", transactionController.rechargeCompanyAccount);
router.put("/", transactionController.updateTransactionWhenUserPaid);
router.use((request, response) => response.status(404).end());

module.exports = router;
