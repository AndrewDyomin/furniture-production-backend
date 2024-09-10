const express = require("express");
const LeadsController = require("../../controllers/leads");
const isAuth = require("../../middlewares/isAuth");

const router = express.Router();
const jsonParser = express.json();

router.get("/all", isAuth, jsonParser, LeadsController.getAll);
router.post("/add", LeadsController.add);
router.post("/update", isAuth, jsonParser, LeadsController.update);
router.post("/remove", isAuth, jsonParser, LeadsController.remove);

module.exports = router;