const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const Order = require("../models/order");
const User = require("../models/user");
const updateSheets = require("../helpers/updateSheets");
const { google } = require("googleapis");
const sendMail = require("../helpers/sendMail");
const pleaseExplainMail = require("../helpers/pleaseExplainMail");
const htmlToPdf = require("html-pdf-node");

async function fetchFabrics(client, spreadsheetId) {
  try {
    const sheets = google.sheets({ version: "v4", auth: client });
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const fabrics = [];

    response.data.sheets.forEach((sheet) => {
      fabrics.push({ title: sheet.properties.title, array: [] });
    });

    for (const sheet of fabrics) {
      const fetchSheet = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheet.title}!A1:B`,
      });
      const priceList = fetchSheet.data.values
      for (const fabric of priceList) {
        const target = fabrics.find(item => item.title === sheet.title)
        target.array.push({name: fabric[0], price: fabric[1]})
      }
      console.log(fetchSheet.data)
    }

    return fabrics;
  } catch (err) {
    console.log(err);
  }
}

async function getAllFabrics(req, res, next) {
  const client = req.sheets.client;

  const spreadsheetId = process.env.FABRICS_SHEET_LINK;

  try {
    // const range = "Лист1!A2:V";
    const request = await fetchFabrics(client, spreadsheetId);

    res.status(200).send(request);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getAllFabrics,
};
