const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    group: {
      type: String,
    },
    size: {
      type: String,
    },
    name: {
      type: String,
      required: [true, 'Set name for item'],
    },
    fabric: {
      type: String,
    },
    description: {
      type: String,
    },
    base: {
      type: String,
    },
    deliveryDate: {
      type: String,
    },
    innerPrice: {
      type: Number,
    },
    number: {
      type: String,
    },
    dealer: {
      type: String,
    },
    deadline: {
      type: Number,
    },
    dateOfOrder: {
      type: String,
    },
    adress: {
      type: String,
    },
    additional: {
      type: String,
    },
    rest: {
      type: String,
    },
    plannedDeadline: {
      type: String,
    },
  }
);

module.exports = mongoose.model("Order", orderSchema);