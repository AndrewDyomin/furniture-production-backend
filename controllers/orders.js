const axios = require('axios');

async function getMebTownOrders() {

    let orders = {};

    try {
        await axios.get('https://script.google.com/macros/s/AKfycbwcORXRXgNA-k1kgMaFBDciWHmNsOTEZp0rYehduCMig-krkRABqrTvlH66zJCfZOHzRA/exec')
        .then((response) => {
            orders = response.data;
        });
        
    } catch(err) {
        console.log(err)
    }

    return orders;
};
   
async function getAllOrders(req, res, next) {

    const orders = await getMebTownOrders();

    res.status(200).send(orders);
};

module.exports = { getAllOrders };