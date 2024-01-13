const express = require("express");

const OrdersController = require("../../controllers/orders");
const isAuth = require("../../middlewares/isAuth")

const router = express.Router();

router.get("/mebtown", isAuth, OrdersController.getMebTownOrders)

module.exports = router;