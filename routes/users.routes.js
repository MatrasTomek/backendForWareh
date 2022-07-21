const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get("/:id", userController.getUser);
router.post("/", userController.loginUser);
router.post("/add", userController.postUser);
router.post("/lost-pass", userController.userLostPassword);
router.put("/", userController.putUser);
router.delete("/:id", userController.deleteUser);
router.use((request, response) => response.status(404).end());

module.exports = router;
