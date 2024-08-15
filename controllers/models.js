const Model = require("../models/model");

async function add(req, res, next) {
    const { name } = req.body;
  
    try {

    let model = await Model.findOne({ name }).exec();

    if (model !== null) {
        return res.status(409).json({ message: "Name in use" });
    }

    model = req.body;

    await Model.create(model);
  
      res.status(200).json({ message: "Model created" });
    } catch (err) {
      console.log(err);
    }
  }

async function remove(req, res, next) {
    const { id } = req.body;
  try {
    await Model.findByIdAndDelete(id)

    res.status(200).json({ message: "collection was deleted" });
  } catch (error) {
    next(error);
  }
};

async function getOne(req, res, next) {
  const { id } = req.body;

  try {

  const model = await Model.findById(id).exec();
  if (model === null) {
    res.status(404).send({"message": "not found"})
  }
  res.status(200).send({ model });

  } catch(error) {
    next(error)
  }
};

async function getAll(req, res, next) {
  try {

  const array = await Model.find({}).exec();
  res.status(200).send({ array });

  } catch(error) {
    next(error)
  }
};

async function update(req, res, next) {

  const { _id, name, family, description, price, size, sleepingArea, images } = req.body;
  
  try {
    const updatedModel = await Model.findByIdAndUpdate(_id, { name, family, description, price, size, sleepingArea, images }, { new: true }).exec();

    res.status(200).send(updatedModel);
  } catch (error) {
    next(error);
  }
};

module.exports = { add, remove, getOne, getAll, update };