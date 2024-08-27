const express = require("express");
const { upload } = require("../../middlewares/upload");
const DruftsController = require("../../controllers/drufts");
// const isAuth = require("../../middlewares/isAuth");
const druftToDisk = require("../../middlewares/druftToDisk");

const router = express.Router();
const jsonParser = express.json();

router.get("/all", jsonParser, DruftsController.getAll);
router.post("/get", jsonParser, DruftsController.getOne);
router.post("/add", jsonParser, upload.array("file", 12), druftToDisk, DruftsController.add);
router.post("/update", jsonParser, upload.array("file", 12), druftToDisk, DruftsController.update);
router.post("/remove", DruftsController.remove);

module.exports = router;