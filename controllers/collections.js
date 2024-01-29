const collectionSchema = require("../schemas/collection");
const Collection = require("../models/collection");

async function add(req, res, next) {

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
  const response = collectionSchema.validate(req.body, { abortEarly: false });

  if (typeof response.error !== "undefined") {
    return res
    .status(400)
    .send(response.error.details.map((err) => err.message).join(", "));
  }


    try {

      const { id, group, name, dimensions, subscription, images, components } = req.body;
      const newCollection = await Collection.findByIdAndUpdate(id, { group, name, dimensions, subscription, images, components }, { new: true }).exec();

      res.status(200).send(newCollection);
    } catch (error) {
      next(error);
    }
  };

module.exports = { add, remove, getOne, getAll, update };