import Joi from "joi";

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  ACCESS_SECRET: Joi.string().required(),
  ACCESS_TIME: Joi.number().required(),
});