const mongoose = require("mongoose");

const druftSchema = new mongoose.Schema({
  description: {
    type: String,
    default: "",
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

module.exports = mongoose.model("Druft", druftSchema);