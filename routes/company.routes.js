const express = require("express");
const companyController = require("../controllers/company.controller");
const cors = require("cors");
const router = express.Router();
router.use(cors());

router.get("/:userId", cors(), companyController.getAllCompaniesForUser);
// router.get("/:login", userController.getUser);
// router.post("/", userController.loginUser);
router.post("/add", cors(), companyController.postCompany);
router.put("/", cors(), companyController.putCompany);
router.delete("/:id", cors(), companyController.deleteCompany);

router.use((request, response) => response.status(404).end());

module.exports = router;