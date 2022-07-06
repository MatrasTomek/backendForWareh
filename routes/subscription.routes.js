const express = require("express");
const subscriptionController = require("../controllers/subscription.controller");

const router = express.Router();

router.get("/:companyId", subscriptionController.getSubscriptionForOneCompany);
router.post("/add", subscriptionController.postSubscription);
router.delete("/:id", subscriptionController.delSubscription);
router.use((request, response) => response.status(404).end());

module.exports = router;
