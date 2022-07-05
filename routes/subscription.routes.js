const express = require("express");
const subscriptionController = require("../controllers/subscription.controller");
const cors = require("cors");
const router = express.Router();
router.use(cors());

router.get("/:companyId", cors(), subscriptionController.getSubscriptionForOneCompany);
router.post("/add", cors(), subscriptionController.postSubscription);
// router.put("/", cors(), companyController.putCompany);
router.delete("/:id", cors(), subscriptionController.delSubscription);

router.use((request, response) => response.status(404).end());

module.exports = router;
