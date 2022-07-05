const express = require("express");
const companyController = require("../controllers/company.controller");
const cors = require("cors");
const router = express.Router();
router.use(cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }));

router.get(
	"/:userId",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	companyController.getAllCompaniesForUser,
);
// router.get("/:login", userController.getUser);
// router.post("/", userController.loginUser);
router.post(
	"/add",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	companyController.postCompany,
);
router.put(
	"/",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	companyController.putCompany,
);
router.delete(
	"/:id",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	companyController.deleteCompany,
);

router.use((request, response) => response.status(404).end());

module.exports = router;
