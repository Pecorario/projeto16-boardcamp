import joi from 'joi';

export const gameSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().uri({ scheme: ['http', 'https'] }).required(),
  stockTotal: joi.number().integer().positive().required(),
  pricePerDay: joi.number().positive().required(),
});