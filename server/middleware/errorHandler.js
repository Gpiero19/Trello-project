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
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  
  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Resource already exists' });
  }
  
  // Sequelize foreign key errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: 'Referenced resource does not exist' });
  }
  
  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ error: 'Database error' });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }
  
  // Invalid ID format (e.g., non-numeric ID passed to route)
  if (err.name === 'CastError' || err.name === 'ObjectParameter') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  // JSON parse error (malformed request body)
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  
  // TypeError (undefined property access - internal bug)
  if (err instanceof TypeError) {
    console.error('TypeError:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  
  // Timeout errors
  if (err.name === 'TimeoutError' || err.code === 'ETIMEDOUT') {
    return res.status(503).json({ error: 'Request timeout' });
  }
  
  // Custom operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  
  // Default server error
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
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
