const express = require("express");
const cors = require("cors");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.use(cors({ origin: "*" }));

// router.get("/", eventsController.getEvents);
router.get("/:login", cors(), userController.getUser);
router.post("/", cors(), userController.loginUser);
router.post("/add", cors(), userController.postUser);
router.put("/", cors(), userController.putUser);
router.delete("/:id", cors(), userController.deleteUser);

router.use((request, response) => response.status(404).end());

module.exports = router;
