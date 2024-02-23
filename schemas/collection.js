const Joi = require("joi");

const collectionSchema = Joi.object({
    id: Joi.string(),
    group: Joi.string().required(),
    name: Joi.string().required(),
    dimensions: Joi.object({
      width: Joi.number().required(),
      height: Joi.number().required(),
      depth: Joi.number().required(),
    }),
    description: Joi.string(),
    basePrice: Joi.number().required(),
    images: Joi.array().items(Joi.string()),
    components: Joi.array().items(Joi.object({
      id: Joi.string(),
      quantity: Joi.string(),
    })),
});

module.exports = collectionSchema;