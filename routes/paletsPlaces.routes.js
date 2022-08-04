const express = require("express");
const palletsController = require("../controllers/palletsPlaces.controller");
const router = express.Router();

router.get("/:id", palletsController.getPalletsPlacesById);
router.post("/add", palletsController.postPalletsPlaces);
router.put("/", palletsController.putPalletsPlaces);
router.put("/pallets-taken", palletsController.putGoodsWasTaken);
router.use((request, response) => response.status(404).end());

module.exports = router;
