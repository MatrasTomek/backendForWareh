const express = require("express");
const servicesController = require("../controllers/service.controller");
const router = express.Router();

router.get("/:id", servicesController.getServiceByMieId);
router.get("/joinedinfo/:id", servicesController.getAllJoinedInfoTransakcjeId);
router.get("/warehinfo/:id", servicesController.getAllJoinedInfoByWarehId);
router.get("/companyinfo/:id", servicesController.getAllJoinedInfoByCompanyId);
router.post("/add", servicesController.postService);
router.use((request, response) => response.status(404).end());

module.exports = router;
