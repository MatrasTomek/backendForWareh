const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get("/:login", userController.getUser);
router.post("/", userController.loginUser);
router.post("/add", userController.postUser);
router.put("/", userController.putUser);
router.delete("/:id", userController.deleteUser);
router.use((request, response) => response.status(404).end());

module.exports = router;
