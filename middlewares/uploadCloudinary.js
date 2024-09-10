const fs = require("fs");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function uploadToCloudinary(req, res, next) {
  try {
    const imageLinks = [];
    const files = req.files;

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path);

      imageLinks.push(result.public_id);

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Error", err);
        }
      });
    }
    if (!req.body.images || req.body.images.length === 0) {
      req.body.images = imageLinks;
    } else {
      const newArray = [...req.body.images, ...imageLinks];
      req.body.images = newArray;
    }
    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = uploadToCloudinary;
