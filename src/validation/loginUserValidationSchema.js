import Joi from 'joi';

export const userLoginValidationSchema = Joi.object({
  email: Joi.string().required().min(1).max(30),
  password: Joi.string().required().min(1).max(30),
});
