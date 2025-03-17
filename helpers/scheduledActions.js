const cron = require("node-cron");
const weeklyReport = require("../models/weeklyReport");

const format = (number) => {
    if (number < 10) {
        return ('0' + number);
    } else {
        return number;
    }
}

const report = async () => {
    try {
        const wReport = await weeklyReport.findOne().exec();

        let totalCost = 0;
        let noCostOrders = [];

        wReport.ordersArray.forEach(order => {
            if (order.innerPrice) {
                totalCost += order.innerPrice;
            }
            if (!order.innerPrice) {
                noCostOrders.push(order);
            }
        })
        
        console.log('Недельный отчёт:')
        console.log('На этой неделе мы сделали', wReport.ordersArray.length, 'заказов.')
        console.log('Сумма оборота составляет', totalCost, 'грн.')

        if (noCostOrders.length !== 0) {
           console.log('Заказы без цены:')
            noCostOrders.forEach(order => {
                console.log(order.name, `№${order.number}`, ' заказчик:', order.dealer);
            }) 
        }
        
        // if its ok
        await weeklyReport.findByIdAndUpdate(wReport._id, { ordersArray: [] })
    } catch(err) {
        console.log(err)
    }
}

cron.schedule("0 17 * * 5", () => {
    const now = new Date();
    const today = format(now.getDate())
    const month = format(now.getMonth() + 1)
    const hours = format(now.getHours())
    const minutes = format(now.getMinutes())
    const seconds = format(now.getSeconds())
  console.log(`Scheduled function triggered at ${today}.${month} ${hours}:${minutes}:${seconds}.`);
  // There is body of function
}, {
  scheduled: true,
  timezone: "Europe/Kiev"
});

// cron.schedule("* * * * *", () => {
//     const now = new Date();
//     const today = format(now.getDate())
//     const month = format(now.getMonth() + 1)
//     const hours = format(now.getHours())
//     const minutes = format(now.getMinutes())
//     const seconds = format(now.getSeconds())
//     console.log(`Scheduled function triggered at ${today}.${month} ${hours}:${minutes}:${seconds}.`);
//     // There is body of function
//     report();
//   }, {
//     scheduled: true,
//     timezone: "Europe/Kiev"
//   });