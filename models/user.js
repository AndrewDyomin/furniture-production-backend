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
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
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
});

module.exports = mongoose.model("User", userSchema);
