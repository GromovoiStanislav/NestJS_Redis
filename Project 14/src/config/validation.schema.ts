import Joi from "joi";

export const validationSchema = Joi.object({
    PORT: Joi.number().required(),
});