const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
  family: {
    type: String,
    required: [true, "Family is required"],
  },
  description: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "",
  },
  categories: {
    type: String,
    default: "",
  },
  sleepingArea: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 1000,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  images: [{
    type: String,
  }],
});

module.exports = mongoose.model("Model", modelSchema);
