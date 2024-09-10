const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ["new", "inWork", "solved"],
    default: "new",
  },
  product: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  message: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model("Lead", leadSchema);