const componentSchema = require("../schemas/component");
const Component = require("../models/component");

async function add(req, res, next) {

  const response = componentSchema.validate(req.body, { abortEarly: false });

    if (typeof response.error !== "undefined") {
        return res
        .status(400)
        .send(response.error.details.map((err) => err.message).join(", "));
    }

    const { name } = req.body;

    try {
        let component = await Component.findOne({ name }).exec();
    
        if (component !== null) {
          return res.status(409).json({ message: "Name in use" });
        }

    component = req.body;

    await Component.create(component);
 
    res.status(200).send({ component });

  } catch (error) {
    next(error);
  }
};

async function remove(req, res, next) {
    const { id } = req.body;
  try {
    await Component.findByIdAndDelete(id)

    res.status(200).json({ message: "Component was deleted" });
  } catch (error) {
    next(error);
  }
};

async function getAll(req, res, next) {
  try {

  const array = await Component.find({}).exec();
  res.status(200).send({ array });

  } catch(error) {
    next(error)
  }
};

async function update(req, res, next) {

  try {
    
    const { id, name, description, price, currency, units } = req.body;
    const updatedComponent = await Component.findByIdAndUpdate(id, { name, description, price, currency, units }, { new: true }).exec();

    res.status(200).send(updatedComponent);
  } catch (error) {
    next(error);
  }
};

module.exports = { add, remove, getAll, update };