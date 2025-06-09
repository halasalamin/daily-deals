import Joi from 'joi';

export const updateCompanyOwnerSchema = Joi.object({
  companyId: Joi.string().required().messages({
    'string.empty': 'Company ID is required',
  }),

  username: Joi.string().min(3).max(30).optional().messages({
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must be less than or equal to 30 characters',
  }),

  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be valid',
  }),

  password: Joi.string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9]).{8,}$'))
    .optional()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters and include a capital letter and number',
    }),
}).or('username', 'email', 'password').messages({
  'object.missing': 'At least one field (username, email, or password) must be provided',
});
