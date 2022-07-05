const express = require("express");
const cors = require("cors");
const magController = require("../controllers/mag.controller");

const router = express.Router();

router.use(cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }));

router.get(
	"/",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	magController.getAllMags,
);
router.get(
	"/:id",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	magController.getMag,
);
router.get(
	"/comp/:id",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	magController.getMagByCompId,
);
router.post("/geo", magController.getMagsByGeoCodes);
router.post(
	"/add",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	magController.addMag,
);
router.put(
	"/",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	magController.editMag,
);
router.put(
	"/subscribe",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	magController.editMagSubscribe,
);
router.put(
	"/pallets-sub",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	magController.setMagFreePalletsFromSubscribe,
);
router.put(
	"/pallets",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	magController.editMagFreePallets,
);
router.delete(
	"/:id",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	magController.deleteMag,
);

router.use((request, response) => response.status(404).end());

module.exports = router;
