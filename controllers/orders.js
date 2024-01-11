const sheetsData = require("../helpers/google-sheets-api");

async function getAllOrders(req, res, next) {

    const data = await sheetsData;
    res.status(200).send(data);

};

module.exports = { getAllOrders };