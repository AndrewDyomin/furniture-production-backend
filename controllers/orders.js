const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
const Order = require("../models/order");
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
        // console.log(client)

        if (access.sweetHome) {
            try {
                const response = await axios.get('https://sheets.googleapis.com/v4/spreadsheets/1IGQZ1Fn3_BBGshayGMdFC6foTcGes4igYAef7c1TOQk', {
                    params: {
                        ranges: 'Лист1!A2:P',
                        includeGridData: true,
                    },
                    headers: {
                        Authorization: `Bearer ${client.credentials.access_token}`, 
                    },
                });

                const sheetData = response.data.sheets[0].data;
                const rgbColor = sheetData[0].rowData[4].values[3].userEnteredFormat.backgroundColor;
                const red = rgbColor.red ? Math.round(rgbColor.red * 255).toString(16).padStart(2, '0') : '00';
                const green = Math.round(rgbColor.green * 255).toString(16).padStart(2, '0');
                const blue = Math.round(rgbColor.blue * 255).toString(16).padStart(2, '0');

                const hexColor = `#${red}${green}${blue}`;

                console.log(hexColor);
        
                console.log(sheetData[0].rowData[4].values[3]); 
        
            } catch (error) {
                console.error('Ошибка при получении данных:', error.message);
            }
            // try {
            // const sheets = google.sheets({ version: 'v4', auth: client });
            // const response = await sheets.spreadsheets.get({
            //     spreadsheetId: '1IGQZ1Fn3_BBGshayGMdFC6foTcGes4igYAef7c1TOQk',
            //     ranges: 'Лист1!A2:P',
            //     includeGridData: true,
            // });

            // console.log(response)

            // const rows = response.data.values;
            // if (!rows || rows.length === 0) {
            //     console.log('No data found.');
            //     return;
            // }

            // rows.forEach((row) => {
            //     let order = {
            //         group: row[0],
            //         size: row[1],
            //         name: row[2],
            //         fabric: row[3],
            //         description: row[4],
            //         base: row[5],
            //         deliveryDate: row[6],
            //         innerPrice: row[7],
            //         number: row[8],
            //         dealer: row[9],
            //         deadline: row[10],
            //         dateOfOrder: row[11],
            //         adress: row[12],
            //         additional: row[13],
            //         rest: row[14],
            //         plannedDeadline: row[15],
            //     }
            //     // orders.push(order);
            // });
            // } catch(err) {
            //     console.log(err)
            // } 
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
    const dataBaseOrders = await getDataBaseOrders(req.user);
    const sweetHomeOrders = await getSweetHomeOrders(req.user, req.sheets.client)

    const allOrdersArray = mebTownOrders.concat(homeIsOrders, milliniOrders, otherOrders, dataBaseOrders, sweetHomeOrders);

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
        order._id = uuidv4();
    });

    res.status(200).json({ allOrdersArray });
    } catch(err) {
        console.log(err)
    }
};

async function addOrder(req, res, next) {
    const { number } = req.body;
    const user = req.user.user;
    const today = new Date().toISOString();
    const plannedDate = new Date(today);
    plannedDate.setDate(plannedDate.getDate() + Number(req.body.deadline));

    try {
        let order = await Order.findOne({ number }).exec();
    
        if (order !== null) {
          return res.status(409).json({ message: "Number in use" });
        }

    order = req.body;
    order.dealer = user.name;
    order.dateOfOrder = today;
    order.plannedDeadline = plannedDate.toISOString();


    await Order.create(order);
 
    res.status(200).json({ message: "Order created" });

  } catch (error) {
    next(error);
  }

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