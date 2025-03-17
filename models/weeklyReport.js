const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  name: {
    type: String,
    required: [true, 'Set name for item'],
  },
  dealer: {
    type: String,
  }, 
  innerPrice: {
    type: Number,
  }, 
  number: {
    type: String,
  }, 
  orderStatus: {
    type: String,
  }
})

const weeklyReportSchema = new mongoose.Schema({
  ordersArray: [orderSchema],
});

module.exports = mongoose.model("WeeklyReport", weeklyReportSchema);