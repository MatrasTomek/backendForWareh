const express = require("express");
const cors = require("cors");
const packingController = require("../controllers/packing.controller");

const router = express.Router();

router.use(cors({ origin: "*" }));

router.get("/", cors(), packingController.getPackingTable);
// router.get("/:id", cors(), magController.getMag);
// router.get("/comp/:id", cors(), magController.getMagByCompId);
// router.post("/geo", magController.getMagsByGeoCodes);
// router.post("/add", cors(), magController.addMag);
// router.put("/", cors(), magController.editMag);
// router.put("/subscribe", cors(), magController.editMagSubscribe);
// router.put("/pallets", cors(), magController.editMagFreePallets);
// router.delete("/:id", cors(), magController.deleteMag);

router.use((request, response) => response.status(404).end());

module.exports = router;
