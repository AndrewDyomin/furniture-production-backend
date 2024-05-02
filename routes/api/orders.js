const express = require("express");
const { upload } = require("../../middlewares/upload");

const OrdersController = require("../../controllers/orders");
const isAuth = require("../../middlewares/isAuth");
const googleSheetsApi = require("../../middlewares/googleSheetsApi");
const uploadToDisk = require("../../middlewares/uploadToDisk");

const router = express.Router();
const jsonParser = express.json();

router.get("/all", isAuth, googleSheetsApi, OrdersController.getAllOrders);
router.post("/add", jsonParser, isAuth, upload.array("file", 12), uploadToDisk, googleSheetsApi, OrdersController.addOrder);
router.post("/update", jsonParser, isAuth, upload.array("file", 12), uploadToDisk, googleSheetsApi, OrdersController.updateOrder);
router.post("/archive", isAuth, googleSheetsApi, OrdersController.archiveOrder);
router.delete("/remove", isAuth, OrdersController.deleteOrder);

module.exports = router;