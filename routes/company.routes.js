const express = require("express");
const companyController = require("../controllers/company.controller");
const router = express.Router();

router.get("/:userId", companyController.getAllCompaniesForUser);
// router.get("/:login", userController.getUser);
// router.post("/", userController.loginUser);
router.post("/add", companyController.postCompany);
router.put("/", companyController.putCompany);
router.delete("/:id", companyController.deleteCompany);

router.use((request, response) => response.status(404).end());

module.exports = router;
