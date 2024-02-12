const Joi = require("joi");

const componentSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string().required(),
    subscription: Joi.string(),
    price: Joi.number().required(),
    currency: Joi.string().required(),
    units: Joi.string().required(),
});

module.exports = componentSchema;