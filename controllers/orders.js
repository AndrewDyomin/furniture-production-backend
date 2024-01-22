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

async function getMilliniOrders() {
    
    let orders = [];

    try {
        await axios.get('https://script.google.com/macros/s/AKfycbw_jmQzhpuKhJojM4smG1_sib9paTgJfiIPEJuDaTzxELnCdQpmVdeafWgXX9L16Ufu/exec')
        .then((response) => {
            orders = response.data.orders;
            return(orders);
        });
        
    } catch(err) {
        console.log(err)
    }

    return orders;
};

async function getOtherOrders() {
    
    let orders = [];

    try {
        await axios.get('https://script.google.com/macros/s/AKfycbzdAGJlrqjaqHIFC3x8Y8ZixzuZH8lARPOfzCl4iv8fWIUBdfztgK3nCWLqedfxcQfl3Q/exec')
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
    const milliniOrders = await getMilliniOrders();
    const otherOrders = await getOtherOrders();

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

    res.status(200).json({ allOrdersArray });
};

module.exports = { getAllOrders };