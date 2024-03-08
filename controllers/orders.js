const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
const Order = require("../models/order");
const updateSheets = require("../helpers/updateSheets");
const {google} = require('googleapis');


async function getMebTownOrders(user) {

    let orders = [];
    const { access } = user.user;
    
    if (access.mebTown) {
        try {
            await axios.get(process.env.MEBTOWN_LINK)
            .then((response) => {
                orders = response.data.orders;
                return(orders);
            });
            
        } catch(err) {
            console.log(err)
        }
    }

    return orders;
};

async function getHomeIsOrders(user) {

    let orders = [];
    const { access } = user.user;
    
    if (access.homeIs) {
        try {
            await axios.get(process.env.HOMEIS_LINK)
            .then((response) => {
                orders = response.data.orders;
                return(orders);
            });
            
        } catch(err) {
            console.log(err)
        }
    }

    return orders;
};

async function getMilliniOrders(user) {
    
    let orders = [];
    const { access } = user.user;
    
    if (access.millini) {
        try {
            await axios.get(process.env.MILLINI_LINK)
            .then((response) => {
                orders = response.data.orders;
                return(orders);
            });
            
        } catch(err) {
            console.log(err)
        }
    }

    return orders;
};

async function getOtherOrders(user) {
    
    let orders = [];
    const { access } = user.user;
    
    if (access.other) {
        try {
            await axios.get(process.env.OTHER_LINK)
            .then((response) => {
                orders = response.data.orders;
                return(orders);
            });
            
        } catch(err) {
            console.log(err)
        }
    }

    return orders;
};

async function getSweetHomeOrders(user, client) {

    const { access } = user.user;
    const orders = [];

    if (access.sweetHome) {
        try {
        const sheets = google.sheets({ version: 'v4', auth: client });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SWEET_HOME_SHEET_LINK,
            range: 'Лист1!A2:R',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            console.log('No data found.');
            return;
        }

        rows.forEach((row, index) => {
            const dateOfOrderString = row[11];
            const deadlineString = row[15];
            const dateOfOrderParts = dateOfOrderString.split('.');
            const deadlineParts = deadlineString.split('.');
            const dateOfOrderObject = new Date(`${dateOfOrderParts[2]}-${dateOfOrderParts[1]}-${dateOfOrderParts[0]}`);
            const deadlineObject = new Date(`${deadlineParts[2]}-${deadlineParts[1]}-${deadlineParts[0]}`)
            
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
                _id: row[17],
            }

            if (!row[17] || row[17] === '') {
                const id = uuidv4();
                const range = `Лист1!R${index + 2}`;
                const identify = updateSheets(sheets, process.env.SWEET_HOME_SHEET_LINK , range, id);
                order._id = id;
            }

            orders.push(order);
        });
        } catch(err) {
            console.log(err)
        } 
    }

    return orders;
};

async function getDataBaseOrders(user) {
    
    let orders = [];
    const { description, name } = user.user;
    
    try {
        if (description === 'administrator') {
            orders = await Order.find({}).exec();
        } else if (description === 'manager') {
            orders = await Order.find({ dealer: name }).exec();
        }
        return orders;
    } catch (err) {
        console.error(err);
        return orders;
    }
};

async function getAllOrders(req, res, next) {

    try {

    const mebTownOrders = await getMebTownOrders(req.user);
    const homeIsOrders = await getHomeIsOrders(req.user);
    const milliniOrders = await getMilliniOrders(req.user);
    const otherOrders = await getOtherOrders(req.user);
    const sweetHomeOrders = await getSweetHomeOrders(req.user, req.sheets.client)

    const allOrdersArray = mebTownOrders.concat(homeIsOrders, milliniOrders, otherOrders, sweetHomeOrders);

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

    allOrdersArray.map((order) => {
        if (!order.dealer.includes('Одесса')) {
           order._id = uuidv4(); 
        }
    });

    res.status(200).json({ allOrdersArray });
    } catch(err) {
        console.log(err)
    }
};

async function addOrder(req, res, next) {
    
    const user = req.user.user;
    const date = new Date();
    const today = date.toISOString();
    let plannedDate = date;
    plannedDate.setDate(date.getDate() + Number(req.body.deadline));
    const client = req.sheets.client;
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    let spreadsheetId = '';
    let order = req.body;
    order.dealer = user.name;
    order.dateOfOrder = today;
    order.plannedDeadline = `${plannedDate.toISOString()}`;

    if (user.organization === 'misazh') {
        spreadsheetId  = process.env.MISAZH_SHEET_LINK;
    }

    if (user.organization === 'sweethome') {
        spreadsheetId  = process.env.SWEET_HOME_SHEET_LINK;
    }

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Лист1!A2:R',
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
                today,
                `${order.adress}`, 
                ``,
                `${order.rest}`, 
                order.plannedDeadline,
                ``,
                `${uuidv4()}`,
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
    
        const { 
            id,
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
            dateOfOrder,
            adress,
            additional,
            rest,
            plannedDeliveryDate
        } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(id, {
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
            dateOfOrder,
            adress,
            additional,
            rest,
            plannedDeliveryDate
        }, { new: true }).exec();
    
        res.status(200).send(updatedOrder);
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

module.exports = { getAllOrders, addOrder, updateOrder, deleteOrder, getSweetHomeOrders };