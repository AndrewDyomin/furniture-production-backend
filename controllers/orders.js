const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
const Order = require("../models/order");
const updateSheets = require("../helpers/updateSheets");
const {google} = require('googleapis');

async function getOrdersFromSheets(client, spreadsheetId, range, organization) {

    try {
        const sheets = google.sheets({ version: 'v4', auth: client });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const orders = [];

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log('No data found.');
            return orders;
        }

        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];

            if (!row[0] || row[0] === '' || !row[1] || row[1] === '' ) {
                continue;
            }

            const date = new Date();
            const dateOfOrderString = row[11];
            const deadlineString = row[15];
            const dateOfOrderParts = dateOfOrderString.split('.');
            const deadlineParts = !row[15] || row[15] === '' ? [`${date.getDate()}`, `${date.getMonth()}`, `${date.getFullYear}`] : deadlineString.split('.');
            const dateOfOrderObject = new Date(`${dateOfOrderParts[2]}-${dateOfOrderParts[1]}-${dateOfOrderParts[0]}`);
            const deadlineObject = new Date(`${deadlineParts[2]}-${deadlineParts[1]}-${deadlineParts[0]}`);
            const imagesArray = !row[18] || row[18] === '' ? [] : row[18].split(',');

            let order = {
                group: row[0],
                size: row[1],
                name: row[2],
                fabric: row[3],
                description: row[4],
                base: row[5],
                deliveryDate: row[6],
                innerPrice: row[7],
                number: row[8],
                dealer: row[9],
                deadline: row[10],
                dateOfOrder: dateOfOrderObject.toISOString(),
                adress: row[12],
                additional: row[13],
                rest: row[14],
                plannedDeadline: deadlineObject.toISOString(),
                orderStatus: row[16],
                _id: row[17],
                images: imagesArray,
                fabricStatus: row[19] || '',
                coverStatus: row[20] || '',
                frameStatus: row[21] || '',
            };

            if (!row[17] || row[17] === '') {
                const id = [`${organization}.${uuidv4()}`];
                let sheetName = range.slice(0, range.indexOf('!'));
                let updateRange = `${sheetName}!R${index + 2}`;
                await updateSheets(sheets, spreadsheetId, updateRange, id);
                order._id = id;
            }

            orders.push(order);
        }

        return orders;
    } catch(err) {
        console.log(err)
}};

async function getAllOrders(req, res, next) {

    const { access } = req.user.user;
    const client = req.sheets.client;
    let allOrdersArray = [];

    if (access.misazh) {
        let spreadsheetId = process.env.MISAZH_SHEET_LINK;
        let range = 'Лист1!A2:V';
        let organization = 'misazh';
        let orders = await getOrdersFromSheets(client, spreadsheetId, range, organization);
        if (orders.length !== 0) {
            allOrdersArray.push(...orders)};
    };

    if (access.mebTown) {
        let spreadsheetId = process.env.MEBTOWN_SHEET_LINK;
        let range = 'Лист1!A2:V';
        let organization = 'mebtown';
        let orders = await getOrdersFromSheets(client, spreadsheetId, range, organization);
        if (orders.length !== 0) {
            allOrdersArray.push(...orders)};
    };

    if (access.homeIs) {
        let spreadsheetId = process.env.HOMEIS_SHEET_LINK;
        let range = 'Лист1!A2:V';
        let organization = 'homeis';
        let orders = await getOrdersFromSheets(client, spreadsheetId, range, organization);
        if (orders.length !== 0) {
            allOrdersArray.push(...orders)};
    };

    if (access.other) {
        let spreadsheetId = process.env.OTHER_SHEET_LINK;
        let range = 'Лист1!A2:V';
        let organization = 'yura';
        let orders = await getOrdersFromSheets(client, spreadsheetId, range, organization);
        if (orders.length !== 0) {
            allOrdersArray.push(...orders)};
    };

    if (access.sweetHome) {
        let spreadsheetId = process.env.SWEET_HOME_SHEET_LINK;
        let range = 'Лист1!A2:V';
        let organization = 'sweethome';
        let orders = await getOrdersFromSheets(client, spreadsheetId, range, organization);
        if (orders.length !== 0) {
            allOrdersArray.push(...orders)};
    };

    if (access.millini) {
        let spreadsheetId = process.env.MILLINI_SHEET_LINK;
        let range = 'замовлення !A2:V';
        let organization = 'millini';
        let orders = await getOrdersFromSheets(client, spreadsheetId, range, organization);
        if (orders.length !== 0) {
            allOrdersArray.push(...orders)};
    };

    try {

    if (!allOrdersArray.length) {
        res.status(200).send({ message: 'Orders not found' });
    }

    allOrdersArray.sort((a, b) => {
        if (a.plannedDeadline > b.plannedDeadline) {
          return 1;
        }
        if (a.plannedDeadline < b.plannedDeadline) {
          return -1;
        }
        return 0;
      });

    res.status(200).json({ allOrdersArray });
    } catch(err) {
        console.log(err)
    }
};

async function addOrder(req, res, next) {
    
    const user = req.user.user;
    const today = new Date();
    let month = today.getMonth() + 1;
    let plannedDate = new Date();
    plannedDate.setDate(plannedDate.getDate() + Number(req.body.deadline));
    let plannedMonth = plannedDate.getMonth() + 1;
    const client = req.sheets.client;
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    let spreadsheetId = '';
    let range = 'Лист1!A2:S';
    let order = req.body;
    order.dealer = user.name;
    order.dateOfOrder = today;
    order.plannedDeadline = `${plannedDate.getDate()}.${plannedMonth.toString().padStart(2, '0')}.${plannedDate.getFullYear()}`;

    if (user.organization === 'misazh') {
        spreadsheetId  = process.env.MISAZH_SHEET_LINK;
    } else if (user.organization === 'sweethome') {
        spreadsheetId  = process.env.SWEET_HOME_SHEET_LINK;
    } else if (user.organization === 'Yura') {
        spreadsheetId  = process.env.OTHER_SHEET_LINK;
    } else if (user.organization === 'homeIs') {
        spreadsheetId  = process.env.HOMEIS_SHEET_LINK;
    } else if (user.organization === 'mebTown') {
        spreadsheetId  = process.env.MEBTOWN_SHEET_LINK;
    } else if (user.organization === 'millini') {
        spreadsheetId  = process.env.MILLINI_SHEET_LINK;
        range = 'замовлення !A2:S';
    }

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            requestBody: { values: [
                [`${order.group}`, 
                `${order.size}`, 
                `${order.name}`, 
                `${order.fabric}`, 
                `${order.description}`, 
                ``,
                ``,
                ``,
                `${order.number}`,
                `${order.dealer}`, 
                `${order.deadline}`,
                `${today.getDate()}.${month.toString().padStart(2, '0')}.${today.getFullYear()}`,
                `${order.adress}`, 
                ``,
                `${order.rest}`, 
                order.plannedDeadline,
                ``,
                ``,
                `${order.images}`,
            ]
            ] },
        });

        res.status(200).json({ message: "Order created" });
    } catch(err) {
        console.log(err)
    }

//     try {
//         let order = await Order.findOne({ number }).exec();
    
//         if (order !== null) {
//           return res.status(409).json({ message: "Number in use" });
//         }

//     order = req.body;
//     order.dealer = user.name;
//     order.dateOfOrder = today;
//     order.plannedDeadline = plannedDate.toISOString();


//     await Order.create(order);
 
//     res.status(200).json({ message: "Order created" });

//   } catch (error) {
//     next(error);
//   }

};

async function updateOrder(req, res, next) {

    try {

        const client = req.sheets.client;
        const sheets = google.sheets({ version: 'v4', auth: client });
        const { group, size, name, fabric, description, base, deliveryDate, innerPrice, number, dealer, deadline, dateOfOrder, adress, additional, rest, plannedDeadline, orderStatus, _id, fabricStatus, coverStatus, frameStatus, images } = req.body;
        const organization = _id.slice(0, _id.indexOf('.'));
        let spreadsheetId = '';
        let row = '';
        let range = '';

        if (organization === 'misazh') {
            spreadsheetId = process.env.MISAZH_SHEET_LINK;
            range = 'Лист1!A2:V';
        } else if (organization === 'mebtown') {
            spreadsheetId = process.env.MEBTOWN_SHEET_LINK;
            range = 'Лист1!A2:V';
        } else if (organization === 'homeis') {
            spreadsheetId = process.env.HOMEIS_SHEET_LINK;
            range = 'Лист1!A2:V';
        } else if (organization === 'yura') {
            spreadsheetId = process.env.OTHER_SHEET_LINK;
            range = 'Лист1!A2:V';
        } else if (organization === 'sweethome') {
            spreadsheetId = process.env.SWEET_HOME_SHEET_LINK;
            range = 'Лист1!A2:V';
        } else if (organization === 'millini') {
            spreadsheetId = process.env.MILLINI_SHEET_LINK;
            range = 'замовлення !A2:V';
        };

        const orders = await getOrdersFromSheets(client, spreadsheetId, range, organization);

        for (let index = 0; index < orders.length; index++) {
            const order = orders[index];
            if (order._id === _id) {
                row = `${range.slice(0, range.indexOf('!'))}!A${index + 2}:V`;
            }
        }

        const values = [group, size, name, fabric, description, base, deliveryDate, innerPrice, number, dealer, deadline, dateOfOrder, adress, additional, rest, plannedDeadline, orderStatus, _id, images.join(','), fabricStatus, coverStatus, frameStatus];

        await updateSheets(sheets, spreadsheetId, row, values);

        const date = new Date();
        const dateOfOrderParts = dateOfOrder.split('.');
        const deadlineParts = !plannedDeadline || plannedDeadline === '' ? [`${date.getDate()}`, `${date.getMonth()}`, `${date.getFullYear}`] : plannedDeadline.split('.');
        const dateOfOrderObject = new Date(`${dateOfOrderParts[2]}-${dateOfOrderParts[1]}-${dateOfOrderParts[0]}`);
        const deadlineObject = new Date(`${deadlineParts[2]}-${deadlineParts[1]}-${deadlineParts[0]}`);
        const imagesArray = !images ? [] : images;

        const newOrder = {
            group,
            size,
            name,
            fabric,
            description,
            base,
            deliveryDate,
            innerPrice,
            number,
            dealer,
            deadline,
            dateOfOrder: dateOfOrderObject.toISOString(),
            adress,
            additional,
            rest,
            plannedDeadline: deadlineObject.toISOString(),
            orderStatus,
            _id,
            images: imagesArray,
            fabricStatus,
            coverStatus,
            frameStatus,
        };
    
        res.status(200).send(newOrder);
    } catch (error) {
        next(error);
    }
};

async function deleteOrder(req, res, next) {

    const { id } = req.body;
    try {
      await Order.findByIdAndDelete(id)
  
      res.status(200).json({ message: "Order was deleted" });
    } catch (error) {
      next(error);
    }
};

module.exports = { getAllOrders, addOrder, updateOrder, deleteOrder };