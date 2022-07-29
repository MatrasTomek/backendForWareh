const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get("/:id", userController.getUser);
router.post("/", userController.loginUser);
router.post("/add", userController.postUser);
router.post("/lost-pass", userController.userLostPassword);
router.post("/activate", userController.postUserActive);
router.post("/auth", userController.authUser);
router.put("/byid", userController.userChangePassById);
router.put("/byemail", userController.userChangePassByEmail);
router.delete("/:id", userController.deleteUser);
router.use((request, response) => response.status(404).end());

module.exports = router;
