const express = require("express");

const CollectionsController = require("../../controllers/collections");
const isAuth = require("../../middlewares/isAuth")

const router = express.Router();
const jsonParser = express.json();

router.get("/get", jsonParser, isAuth, CollectionsController.get);
router.post("/add", jsonParser, isAuth, CollectionsController.add);
router.post("/update", jsonParser, isAuth, CollectionsController.update);
router.delete("/remove", jsonParser, isAuth, CollectionsController.remove);

module.exports = router;