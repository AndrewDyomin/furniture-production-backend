const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ["USD", "грн"],
    default: "грн",
    required: [true, "Currency is required"],
  },
  units: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("Component", componentSchema);