const express = require("express");
const cors = require("cors");
const palletsController = require("../controllers/palletsPlaces.controller");

const router = express.Router();

router.use(cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }));

// router.get(
//   "/company/:id",
//   cors(),
//   palletsController.getPalletsPlacesForWarehsByCompanyId
// );
router.get(
	"/:id",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	palletsController.getPalletsPlacesById,
);
// router.get("/comp/:id", cors(), palletsController.getMagByCompId);
// router.post("/geo", palletsController.getMagsByGeoCodes);
router.post(
	"/add",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	palletsController.postPalletsPlaces,
);
router.put(
	"/",
	cors({ origin: "*", methods: "GET, HEAD, PUT, PATCH, POST, DELETE", preflightContinue: false }),
	palletsController.putPalletsPlaces,
);
// router.put("/subscribe", cors(), palletsController.editMagSubscribe);
// router.put("/pallets", cors(), palletsController.editMagFreePallets);
// router.delete("/:id", cors(), palletsController.deleteMag);

router.use((request, response) => response.status(404).end());

module.exports = router;
