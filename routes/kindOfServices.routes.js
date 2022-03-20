const express = require("express");
const cors = require("cors");
const kindOfServices = require("../controllers/kindOfServives.controllers");

const router = express.Router();

router.use(cors());

router.get("/", cors(), kindOfServices.getAllKindOfServices);
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