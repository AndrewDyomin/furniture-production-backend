const express = require("express");
const ComponentsController = require("../../controllers/components");
const isAuth = require("../../middlewares/isAuth");

const router = express.Router();
const jsonParser = express.json();

router.get("/all", jsonParser, isAuth, ComponentsController.getAll);
router.post("/add", jsonParser, isAuth, ComponentsController.add);
router.post("/update", jsonParser, isAuth, ComponentsController.update);
router.delete("/remove", jsonParser, isAuth, ComponentsController.remove);

module.exports = router;