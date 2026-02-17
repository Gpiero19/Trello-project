const Joi = require('joi');

// Card validation schemas
const cardSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(5000).allow('', null),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  dueDate: Joi.date().iso().allow(null),
  listId: Joi.number().integer().positive(),
  assignedUserId: Joi.number().integer().positive().allow(null),
  position: Joi.number().min(0),
  isCompleted: Joi.boolean()
});

const cardUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  description: Joi.string().max(5000).allow('', null),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  dueDate: Joi.date().iso().allow(null),
  listId: Joi.number().integer().positive(),
  assignedUserId: Joi.number().integer().positive().allow(null),
  position: Joi.number().min(0),
  isCompleted: Joi.boolean()
}).min(1);

const cardMoveSchema = Joi.object({
  newListId: Joi.number().integer().positive().required(),
  newPosition: Joi.number().min(0).required()
});

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required()
});

const labelSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required()
});

// Validation middleware factory
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { 
    abortEarly: false,
    stripUnknown: true 
  });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  
  req.validatedBody = value;
  next();
};

module.exports = {
  validateCard: validate(cardSchema),
  validateCardUpdate: validate(cardUpdateSchema),
  validateCardMove: validate(cardMoveSchema),
  validateComment: validate(commentSchema),
  validateLabel: validate(labelSchema)
};
