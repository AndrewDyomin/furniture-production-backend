const express = require("express");
const { upload } = require("../../middlewares/upload");
const ModelsController = require("../../controllers/models");
const isAuth = require("../../middlewares/isAuth");

const router = express.Router();
const jsonParser = express.json();

router.get("/all", jsonParser, ModelsController.getAll);
router.post("/get", jsonParser, ModelsController.getOne);
router.post("/add", jsonParser, isAuth, upload.array("file", 12), ModelsController.add);
router.post("/update", jsonParser, isAuth, upload.array("file", 12), ModelsController.update);
router.delete("/remove", jsonParser, isAuth, ModelsController.remove);

module.exports = router;