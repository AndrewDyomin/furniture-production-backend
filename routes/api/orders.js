const express = require("express");

const OrdersController = require("../../controllers/orders");
const isAuth = require("../../middlewares/isAuth")

const router = express.Router();

router.get("/all", isAuth, OrdersController.getAllOrders)

module.exports = router;