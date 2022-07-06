const express = require("express");
const kindOfServices = require("../controllers/kindOfServives.controllers");
const router = express.Router();

router.get("/", kindOfServices.getAllKindOfServices);

router.use((request, response) => response.status(404).end());

module.exports = router;
