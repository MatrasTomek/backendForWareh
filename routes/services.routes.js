const express = require("express");
const cors = require("cors");
const servicesController = require("../controllers/service.controller");

const router = express.Router();

router.use(cors());

router.get("/:id", cors(), servicesController.getServiceByMieId);
router.get("/joinedinfo/:id", cors(), servicesController.getAllJoinedInfoTransakcjeId);
router.get("/warehinfo/:id", cors(), servicesController.getAllJoinedInfoByWarehId);
router.get("/companyinfo/:id", servicesController.getAllJoinedInfoByCompanyId);
// router.post("/geo", palletsController.getMagsByGeoCodes);
router.post("/add", cors(), servicesController.postService);
// router.put("/", cors(), palletsController.putPalletsPlaces);
// router.put("/subscribe", cors(), palletsController.editMagSubscribe);
// router.put("/pallets", cors(), palletsController.editMagFreePallets);
// router.delete("/:id", cors(), palletsController.deleteMag);

router.use((request, response) => response.status(404).end());

module.exports = router;
