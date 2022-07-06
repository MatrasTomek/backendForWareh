const express = require("express");
const magController = require("../controllers/mag.controller");
const router = express.Router();

router.get("/", magController.getAllMags);
router.get("/:id", magController.getMag);
router.get("/comp/:id", magController.getMagByCompId);
router.post("/geo", magController.getMagsByGeoCodes);
router.post("/add", magController.addMag);
router.put("/", magController.editMag);
router.put("/subscribe", magController.editMagSubscribe);
router.put("/pallets-sub", magController.setMagFreePalletsFromSubscribe);
router.put("/pallets", magController.editMagFreePallets);
router.delete("/:id", magController.deleteMag);

router.use((request, response) => response.status(404).end());

module.exports = router;
