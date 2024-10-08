const express = require("express");

const UsersController = require("../../controllers/users");
const isAuth = require("../../middlewares/isAuth")
const { upload } = require("../../middlewares/upload");
const isValidAvatar = require("../../middlewares/isValidAvatar")

const router = express.Router();

router.get("/avatars", isAuth, UsersController.getAvatar);
router.get("/all", isAuth, UsersController.getAll);
router.post("/update", isAuth, UsersController.updateUser);
router.post("/delete", isAuth, UsersController.deleteUser);
router.patch("/avatars", isAuth, upload.single("avatar"), isValidAvatar, UsersController.uploadAvatar)

module.exports = router;