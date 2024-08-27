const Druft = require("../models/druft");

async function add(req, res, next) {
    const { name } = req.body;
  
    try {

    let druft = await Druft.findOne({ name }).exec();

    if (druft !== null) {
        return res.status(409).json({ message: "Name in use" });
    }

    druft = {
      name: req.body.name,
      description: req.body.description,
      imageArrays: [{role: req.user.user.description, images: [...req.body.images]}],
    }

    await Druft.create(druft);
  
      res.status(200).json({ message: "Druft created" });
    } catch (err) {
      console.log(err);
    }
  }

async function remove(req, res, next) {
    const { data } = req.body;
  try {
    await Druft.findByIdAndDelete(data)

    res.status(200).json({ message: "Druft was deleted" });
  } catch (error) {
    next(error);
  }
};

async function getOne(req, res, next) {
  const { id } = req.body;

  try {

  const druft = await Druft.findById(id).exec();
  if (druft === null) {
    res.status(404).send({"message": "not found"})
  }
  res.status(200).send({ druft });

  } catch(error) {
    next(error)
  }
};

async function getAll(req, res, next) {
  try {

  const array = await Druft.find({}).exec();
  res.status(200).send({ array });

  } catch(error) {
    next(error)
  }
};

async function update(req, res, next) {

  const { _id, name, description, images } = req.body;
  const role = req.user.user.description;

  
  try {
    const updateAtRole = await Druft.findOneAndUpdate(
      { _id, "imageArrays.role": role },
      { $set: { "imageArrays.$.images": images } },
      { new: true }
    );

    if (updateAtRole === null) {
      const oldDruft = await Druft.findById(_id).exec();
      await Druft.findByIdAndUpdate(
        _id,
        { imageArrays: [ ...oldDruft.imageArrays, { role, images }] },
        { new: true }
      );
    }
    
    const updatedDruft = await Druft.findByIdAndUpdate(_id, { name, description }, { new: true }).exec();

    res.status(200).send(updatedDruft);
  } catch (error) {
    next(error);
  }
};

module.exports = { add, remove, getOne, getAll, update };