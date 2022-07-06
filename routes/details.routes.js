const express = require("express");
const cors = require("cors");
const router = express.Router();

const detailsController = require("../controllers/details.controller");

router.get("/:id", detailsController.getDetailsById);
router.get("/", detailsController.getAllDetails);
router.post("/add", detailsController.addDetailsToWareh);
router.put("/", detailsController.editWarehDetails);
router.delete("/:id", detailsController.deleteWarehDetails);

module.exports = router;
