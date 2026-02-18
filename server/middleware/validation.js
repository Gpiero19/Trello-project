const Joi = require('joi');

// =====================
// AUTH VALIDATION SCHEMAS
// =====================

// Registration schema
const registerSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required()
});

// Login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// =====================
// USER VALIDATION SCHEMAS
// =====================

const userSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100)
});

const userUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(100)
}).min(1);

// =====================
// BOARD VALIDATION SCHEMAS
// =====================

const boardSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('', null),
  position: Joi.number().min(0)
});

const boardUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  description: Joi.string().allow('', null),
  position: Joi.number().min(0)
}).min(1);

const boardReorderSchema = Joi.object({
  boards: Joi.array().items(Joi.object({
    id: Joi.number().integer().positive().required(),
    position: Joi.number().integer().min(0).required()
  })).required()
});

// =====================
// LIST VALIDATION SCHEMAS
// =====================

const listSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  boardId: Joi.number().integer().positive().required(),
  position: Joi.number().min(0)
});

const listUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  position: Joi.number().min(0)
}).min(1);

const listReorderSchema = Joi.object({
  boardId: Joi.number().integer().positive(),
  lists: Joi.array().items(Joi.object({
    id: Joi.number().integer().positive().required(),
    position: Joi.number().integer().min(0).required()
  })).required()
});

// =====================
// CARD VALIDATION SCHEMAS
// =====================

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

// =====================
// COMMENT VALIDATION SCHEMAS
// =====================

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required()
});

// =====================
// LABEL VALIDATION SCHEMAS
// =====================

const labelSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required(),
  boardId: Joi.number().integer().positive()
});

const labelUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(50),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/)
}).min(1);

// =====================
// TEMPLATE VALIDATION SCHEMAS
// =====================

const templateCardSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(5000).allow('', null)
});

const templateListSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  cards: Joi.array().items(templateCardSchema)
});

const templateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(2000).allow('', null),
  isPublic: Joi.boolean().default(true),
  lists: Joi.array().items(templateListSchema).default([])
});

const templateUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  description: Joi.string().max(2000).allow('', null),
  isPublic: Joi.boolean()
}).min(1);

// =====================
// VALIDATION MIDDLEWARE
// =====================

const { badRequest } = require('./responseFormatter');

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
    return badRequest(res, 'Validation failed', JSON.stringify(errors));
  }
  
  req.validatedBody = value;
  next();
};

module.exports = {
  // Auth
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  
  // User
  validateUser: validate(userSchema),
  validateUserUpdate: validate(userUpdateSchema),
  
  // Board
  validateBoard: validate(boardSchema),
  validateBoardUpdate: validate(boardUpdateSchema),
  validateBoardReorder: validate(boardReorderSchema),
  
  // List
  validateList: validate(listSchema),
  validateListUpdate: validate(listUpdateSchema),
  validateListReorder: validate(listReorderSchema),
  
  // Card
  validateCard: validate(cardSchema),
  validateCardUpdate: validate(cardUpdateSchema),
  validateCardMove: validate(cardMoveSchema),
  
  // Comment
  validateComment: validate(commentSchema),
  
  // Label
  validateLabel: validate(labelSchema),
  validateLabelUpdate: validate(labelUpdateSchema),

  // Template
  validateTemplate: validate(templateSchema),
  validateTemplateUpdate: validate(templateUpdateSchema)
};
