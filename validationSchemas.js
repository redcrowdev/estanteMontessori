const Joi = require('joi');

module.exports.joiActivitySchema = Joi.object({
   activity: Joi.object({
      title: Joi.string().required(),
      ages: Joi.string().required(),
      sensiblePeriod: Joi.string().required(),
      category: Joi.string(),
      theme: Joi.string(),
      description: Joi.string().required(),
      owned: Joi.string().required(),
      picture: Joi.string()
   }).required()
});