const express = require("express");

const FabricsController = require("../../controllers/fabrics");
const isAuth = require("../../middlewares/isAuth");
const googleSheetsApi = require("../../middlewares/googleSheetsApi");

const router = express.Router();

router.get("/all", isAuth, googleSheetsApi, FabricsController.getAllFabrics);

module.exports = router;