const express = require("express");
const { upload } = require("../../middlewares/upload");
const CalcController = require("../../controllers/calculations");
const druftToDisk = require("../../middlewares/druftToDisk");
const isAuth = require("../../middlewares/isAuth");

const router = express.Router();
const jsonParser = express.json();

// router.post("/get", jsonParser, DruftsController.getOne);
router.post("/send", isAuth, jsonParser, upload.array("file", 12), druftToDisk, CalcController.send);
// router.post("/update", jsonParser, upload.array("file", 12), druftToDisk, DruftsController.update);
// router.post("/remove", DruftsController.remove);

module.exports = router;