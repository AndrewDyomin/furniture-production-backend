const express = require("express");

const OrdersController = require("../../controllers/orders");
const isAuth = require("../../middlewares/isAuth")

const router = express.Router();

router.get("/all", isAuth, OrdersController.getAllOrders);
router.post("/add", isAuth, OrdersController.addOrder);
router.get("/update", isAuth, OrdersController.updateOrder);
router.delete("/remove", isAuth, OrdersController.deleteOrder);

module.exports = router;