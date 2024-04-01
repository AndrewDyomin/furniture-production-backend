const collectionSchema = require("../schemas/collection");
const Collection = require("../models/collection");
const axios = require('axios');
const FormData = require('form-data');
const fs = require('node:fs');

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

async function add(req, res, next) {
  const files = req.files;
  let imageLinks = [];

  try {
    for (const file of files) {

      const formData = new FormData();
      formData.append('image', fs.createReadStream(file.path));

      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
        headers: formData.getHeaders()
      });

      imageLinks.push(response.data.data.url);

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error('Error', err);
          return;
        }});

    }
  } catch(error) {
      console.log(error)
    }
  req.body.images = imageLinks;

  const response = collectionSchema.validate(req.body, { abortEarly: false });

    if (typeof response.error !== "undefined") {
        return res
        .status(400)
        .send(response.error.details.map((err) => err.message).join(", "));
    }

    const { name } = req.body;

    try {
        let collection = await Collection.findOne({ name }).exec();
    
        if (collection !== null) {
          return res.status(409).json({ message: "Name in use" });
        }

    collection = req.body;

    await Collection.create(collection);
 
    res.status(200).send({ collection });

  } catch (error) {
    next(error);
  }
};

async function remove(req, res, next) {
    const { id } = req.body;
  try {
    await Collection.findByIdAndDelete(id)

    res.status(200).json({ message: "collection was deleted" });
  } catch (error) {
    next(error);
  }
};

async function getOne(req, res, next) {
  const { id } = req.body;

  try {

  const collection = await Collection.findById(id).exec();
  res.status(200).send({ collection });

  } catch(error) {
    next(error)
  }
};

async function getAll(req, res, next) {
  try {

  const array = await Collection.find({}).exec();
  res.status(200).send({ array });

  } catch(error) {
    next(error)
  }
};

async function update(req, res, next) {
  const files = req.files;

  try {
    for (const file of files) {

      const formData = new FormData();
      formData.append('image', fs.createReadStream(file.path));

      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
        headers: formData.getHeaders()
      });

      req.body.images.push(response.data.data.url);

      fs.unlink(file.path, (err) => {
        if (err) {
          console.error('Error', err);
          return;
        }});

    }
    console.log(req.body)
    console.log('2: ', req.body._id);
    console.log('3: ', JSON.parse(req.body.components));
    // const { id, name, dimensions, description, basePrice, components } = req.body;
    // const updatedCollection = await Collection.findByIdAndUpdate(id, { name, dimensions, description, basePrice, components }, { new: true }).exec();

    // res.status(200).send(updatedCollection);
  } catch (error) {
    next(error);
  }
};

async function updateImages(req, res, next) {

  try {

    const { id, images } = req.body;
    const updatedCollection = await Collection.findByIdAndUpdate(id, { images }, { new: true }).exec();

    res.status(200).send(updatedCollection);
  } catch (error) {
    next(error);
  }
};

module.exports = { add, remove, getOne, getAll, update, updateImages };