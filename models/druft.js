const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  role: {
    type: String,
  },
  images: [{
    type: String,
  }],
})

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
  imageArrays: [imageSchema],
});

module.exports = mongoose.model("Druft", druftSchema);