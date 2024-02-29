const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  description: {
    type: String,
    enum: ["administrator", "manager", "guest"],
    default: "guest",
    required: [true, "Description is required"],
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: null,
  },
  access: {
      mebTown: {
        type: Boolean,
        default: false,
      },
      homeIs: {
        type: Boolean,
        default: false,
      },
      millini: {
        type: Boolean,
        default: false,
      },
      other: {
        type: Boolean,
        default: false,
      }
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  }
});

module.exports = mongoose.model("User", userSchema);
