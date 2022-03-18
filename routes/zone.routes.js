const express = require("express");
const router = express.Router();
const zoneController = require("../controllers/zone.controller");

// >>>>For request by city from STREFY <<<

router.get("/:itemData", zoneController.getZoneByCityFromStrefy);

module.exports = router;
