const path = require("node:path");
const crypto = require("node:crypto");
const axios = require('axios');

const multer = require("multer");
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "tmp"));
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const suffix = crypto.randomUUID();

    cb(null, `${basename}-${suffix}${extname}`);
  },
});

const upload = multer({ storage });

async function imgbbApi(req, res, next) {
  try {
    const files = req.files;
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file.data);
      const response = await axios.post('https://api.imgbb.com/1/upload?key=IMGBB_API_KEY', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }});
      uploadedUrls.push(response.data.data.url);
    }
      req.body.images = [...uploadedUrls];
  } catch (error) {
      console.error('Upload error ImgBB:', error);
      throw error;
  }
}

module.exports = { upload, imgbbApi }