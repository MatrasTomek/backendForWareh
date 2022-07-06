const express = require("express");
const packingController = require("../controllers/packing.controller");
const router = express.Router();

router.get("/", packingController.getPackingTable);
router.use((request, response) => response.status(404).end());

module.exports = router;
