const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();


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

async function getAllOrders(req, res, next) {

    const mebTownOrders = await getMebTownOrders(req.user);
    const homeIsOrders = await getHomeIsOrders(req.user);
    const milliniOrders = await getMilliniOrders(req.user);
    const otherOrders = await getOtherOrders(req.user);

    const allOrdersArray = mebTownOrders.concat(homeIsOrders, milliniOrders, otherOrders);

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
};

module.exports = { getAllOrders };