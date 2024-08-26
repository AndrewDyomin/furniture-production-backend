const express = require("express");
const { upload } = require("../../middlewares/upload");
const DruftsController = require("../../controllers/drufts");
const isAuth = require("../../middlewares/isAuth");
const druftToDisk = require("../../middlewares/druftToDisk");

const router = express.Router();
const jsonParser = express.json();

router.get("/all", jsonParser, isAuth, DruftsController.getAll);
router.post("/get", jsonParser, isAuth, DruftsController.getOne);
router.post("/add", jsonParser, isAuth, upload.array("file", 12), druftToDisk, DruftsController.add);
router.post("/update", jsonParser, isAuth, upload.array("file", 12), druftToDisk, DruftsController.update);
router.delete("/remove", jsonParser, isAuth, DruftsController.remove);

module.exports = router;