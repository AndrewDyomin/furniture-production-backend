const express = require("express");
const { upload } = require("../../middlewares/upload");

const OrdersController = require("../../controllers/orders");
const isAuth = require("../../middlewares/isAuth");
const googleSheetsApi = require("../../middlewares/googleSheetsApi")

const router = express.Router();
const jsonParser = express.json();

router.get("/all", isAuth, googleSheetsApi, OrdersController.getAllOrders);
router.post("/add", jsonParser, isAuth, upload.array("file", 12), OrdersController.addOrder);
router.post("/update", jsonParser, isAuth, OrdersController.updateOrder);
router.delete("/remove", isAuth, OrdersController.deleteOrder);

module.exports = router;