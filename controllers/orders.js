const axios = require('axios');

async function getMebTownOrders() {

    let orders = [];

    try {
        await axios.get('https://script.google.com/macros/s/AKfycbwcORXRXgNA-k1kgMaFBDciWHmNsOTEZp0rYehduCMig-krkRABqrTvlH66zJCfZOHzRA/exec')
        .then((response) => {
            orders = response.data.orders;
            return(orders);
        });
        
    } catch(err) {
        console.log(err)
    }

    return orders;
};

async function getHomeIsOrders() {

    let orders = [];

    try {
        await axios.get('https://script.google.com/macros/s/AKfycbziRFn4n9g5Wo_zolCnERQyWq-Je9cIdNEcZWdkAXHMP6gKS8-hTadQKy4VKOtVEZUl/exec')
        .then((response) => {
            orders = response.data.orders;
            return(orders);
        });
        
    } catch(err) {
        console.log(err)
    }

    return orders;
};

async function getAllOrders(req, res, next) {

    const mebTownOrders = await getMebTownOrders();
    const homeIsOrders = await getHomeIsOrders();

    const allOrdersArray = mebTownOrders.concat(homeIsOrders);

    res.status(200).json({ allOrdersArray });
};

module.exports = { getAllOrders };