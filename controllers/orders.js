const axios = require('axios');

async function getMebTownOrders(req, res, next) {

    let orders = {};

    try {
        await axios.get('https://script.google.com/macros/s/AKfycbwcORXRXgNA-k1kgMaFBDciWHmNsOTEZp0rYehduCMig-krkRABqrTvlH66zJCfZOHzRA/exec')
        .then((response) => {
            orders = response.data;
            res.status(200).send(orders);
        });
        
    } catch(err) {
        console.log(err)
    }

    return orders;
};

module.exports = { getMebTownOrders };