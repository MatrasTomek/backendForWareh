const express = require("express");
const cors = require("cors");
const palletsController = require("../controllers/palletsPlaces.controller");

const router = express.Router();

router.use(cors());

router.get(
  "/company/:id",
  cors(),
  palletsController.getPalletsPlacesForCompanyById
);
router.get("/:id", cors(), palletsController.getPalletsPlacesById);
// router.get("/comp/:id", cors(), palletsController.getMagByCompId);
// router.post("/geo", palletsController.getMagsByGeoCodes);
router.post("/add", cors(), palletsController.postPalletsPlaces);
router.put("/", cors(), palletsController.putPalletsPlaces);
// router.put("/subscribe", cors(), palletsController.editMagSubscribe);
// router.put("/pallets", cors(), palletsController.editMagFreePallets);
// router.delete("/:id", cors(), palletsController.deleteMag);

router.use((request, response) => response.status(404).end());

module.exports = router;
