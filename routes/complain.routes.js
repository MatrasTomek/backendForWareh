const express = require("express");
const complainController = require("../controllers/complain.controller");
const router = express.Router();

router.get("/:mie_id", complainController.getComplainByMieId);
router.post("/set-by-user", complainController.postComplainByUser);

router.use((request, response) => response.status(404).end());

module.exports = router;
