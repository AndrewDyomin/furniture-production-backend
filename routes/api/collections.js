const express = require("express");
const { upload } = require("../../middlewares/upload");
const CollectionsController = require("../../controllers/collections");
const isAuth = require("../../middlewares/isAuth");
const { imgbbApi } = require("../../middlewares/upload");

const router = express.Router();
const jsonParser = express.json();

router.get("/get", jsonParser, CollectionsController.getOne);
router.get("/all", jsonParser, CollectionsController.getAll);
router.post("/add", jsonParser, isAuth, upload.single("file"), CollectionsController.add);
router.post("/update", jsonParser, isAuth, CollectionsController.update);
router.delete("/remove", jsonParser, isAuth, CollectionsController.remove);

module.exports = router;