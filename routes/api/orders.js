const express = require("express");

const OrdersController = require("../../controllers/orders");
const isAuth = require("../../middlewares/isAuth")

const router = express.Router();
const jsonParser = express.json();

router.get("/all", isAuth, OrdersController.getAllOrders);
router.post("/add", jsonParser, isAuth, OrdersController.addOrder);
router.post("/update", jsonParser, isAuth, OrdersController.updateOrder);
router.delete("/remove", isAuth, OrdersController.deleteOrder);

module.exports = router;