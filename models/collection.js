const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  group: {
    type: String,
  },
  name: {
    type: String,
    default: '',
  },
  dimensions: {
    width: { 
        type: Number, 
        required: true 
    },
    height: { 
        type: Number, 
        required: true 
    },
    depth: { 
        type: Number, 
        required: true 
    },
  },
  subscription: {
    type: String,
    default: null,
  },
  basePrice: {
    tupe: Number,
    required: true,
  },
  images: [{
    type: String,
  }],
  components: [{
    type: String,
  }],
});

module.exports = mongoose.model("Collection", collectionSchema);