const express = require("express");
const { upload } = require("../../middlewares/upload");
const CollectionsController = require("../../controllers/collections");
const isAuth = require("../../middlewares/isAuth");

const router = express.Router();
const jsonParser = express.json();

router.get("/get", jsonParser, CollectionsController.getOne);
router.get("/all", jsonParser, CollectionsController.getAll);
router.post("/add", jsonParser, isAuth, upload.array("file", 12), CollectionsController.add);
router.post("/update", jsonParser, isAuth, upload.array("file", 12), CollectionsController.update);
router.post("/update-images", jsonParser, isAuth, upload.array("file", 12), CollectionsController.updateImages);
router.delete("/remove", jsonParser, isAuth, CollectionsController.remove);

module.exports = router;