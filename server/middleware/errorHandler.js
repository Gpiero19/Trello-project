const { badRequest, unauthorized, notFound, conflict, serverError } = require('./responseFormatter');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Centralized error handler
const errorHandler = (err, req, res, next) => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }
  
  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({ field: e.path, message: e.message }));
    return badRequest(res, 'Validation failed', JSON.stringify(errors));
  }
  
  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return conflict(res, 'Resource already exists');
  }
  
  // Sequelize foreign key errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return badRequest(res, 'Referenced resource does not exist');
  }
  
  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    return serverError(res, 'Database error');
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return unauthorized(res, 'Invalid token');
  }
  
  if (err.name === 'TokenExpiredError') {
    return unauthorized(res, 'Token expired');
  }
  
  // Invalid ID format (e.g., non-numeric ID passed to route)
  if (err.name === 'CastError' || err.name === 'ObjectParameter') {
    return badRequest(res, 'Invalid ID format');
  }
  
  // JSON parse error (malformed request body)
  if (err instanceof SyntaxError && err.status === 400) {
    return badRequest(res, 'Invalid JSON in request body');
  }
  
  // TypeError (undefined property access - internal bug)
  if (err instanceof TypeError) {
    console.error('TypeError:', err);
    return serverError(res, 'Internal server error');
  }
  
  // Timeout errors
  if (err.name === 'TimeoutError' || err.code === 'ETIMEDOUT') {
    return serverError(res, 'Request timeout', 'Service temporarily unavailable');
  }
  
  // Custom operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({ 
      success: false, 
      error: err.message 
    });
  }
  
  // Default server error
  return serverError(res, 'Internal server error');
};

// Async handler wrapper to catch errors in async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler
};
