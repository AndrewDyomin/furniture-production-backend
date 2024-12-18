const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
});

const collectionSchema = new mongoose.Schema({
  group: {
    type: String,
  },
  name: {
    type: String,
    default: "",
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    depth: {
      type: Number,
      required: true,
    },
  },
  description: {
    type: String,
    default: null,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  components: [componentSchema],
  costCalc: {
    corner: {
      type: Boolean,
      default: false,
    },
    module: {
      type: Boolean,
      default: false,
    },
    drawstrings: {
      type: Boolean,
      default: false,
    },
    armrests: {
      type: Boolean,
      default: false,
    },
  },
});

module.exports = mongoose.model("Collection", collectionSchema);
