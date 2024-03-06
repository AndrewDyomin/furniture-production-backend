require('dotenv').config();
const { google } = require('googleapis');
const keys = require('../tmp/misage-factory-project-7c85ed9a5fbd.json');

function googleSheetsApi(req, res, next) {

    try {

       const client = new google.auth.JWT(
            keys.client_email,
            null,
            keys.private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        client.authorize(function(err, tokens) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log('Google sheets connection successfully');
            }
        }); 

    req.sheets = { client };

    next();
    } catch (error) {
    next(error);
    }
}

module.exports = googleSheetsApi;