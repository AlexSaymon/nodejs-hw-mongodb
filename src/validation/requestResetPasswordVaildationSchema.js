import Joi from 'joi';

export const requestResetPasswordEmailValidationSchema = Joi.object({
  email: Joi.string().required().min(1).max(40),
});
