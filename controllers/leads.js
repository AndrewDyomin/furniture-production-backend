const Lead = require("../models/lead");

async function add(req, res, next) {
  try {
    let lead = req.body;
    console.log(lead)

    await Lead.create(lead);

    res.status(200).json({ message: "Lead was created" });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  const { id } = req.body;
  try {
    await Lead.findByIdAndDelete(id);

    res.status(200).json({ message: "Lead was deleted" });
  } catch (error) {
    next(error);
  }
}

async function getAll(req, res, next) {
  try {
    const array = await Lead.find({}).exec();
    res.status(200).send({ array });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { id, name, phone, email, status, product, message } = req.body;
    await Lead.findByIdAndUpdate(
      id,
      { name, phone, email, status, product, message },
      { new: true }
    ).exec();

    res.status(200).json({ message: "Lead was updated" });
  } catch (error) {
    next(error);
  }
}

module.exports = { add, remove, getAll, update };