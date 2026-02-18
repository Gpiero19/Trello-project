/**
 * Standardized API Response Formatter
 * 
 * All API responses follow this format:
 * {
 *   success: true/false,
 *   data: {...} | [...],
 *   message: "Optional message",
 *   error: "Error message (only on failure)"
 * }
 */

/**
 * Send success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {*} data - Data to return
 * @param {string} message - Optional success message
 */
const successResponse = (res, statusCode, data, message = null) => {
  const response = {
    success: true,
    data
  };
  
  if (message) {
    response.message = message;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} error - Error message
 * @param {string} message - Optional detailed message
 */
const errorResponse = (res, statusCode, error, message = null) => {
  const response = {
    success: false,
    error
  };
  
  if (message) {
    response.message = message;
  }
  
  return res.status(statusCode).json(response);
};

// Convenience methods for common response types

const created = (res, data, message = 'Resource created successfully') => 
  successResponse(res, 201, data, message);

const ok = (res, data, message = null) => 
  successResponse(res, 200, data, message);

const deleted = (res, message = 'Resource deleted successfully') => 
  successResponse(res, 200, null, message);

const badRequest = (res, error, message = null) => 
  errorResponse(res, 400, error, message);

const unauthorized = (res, error = 'Unauthorized', message = null) => 
  errorResponse(res, 401, error, message);

const forbidden = (res, error = 'Forbidden', message = null) => 
  errorResponse(res, 403, error, message);

const notFound = (res, error = 'Resource not found', message = null) => 
  errorResponse(res, 404, error, message);

const conflict = (res, error = 'Resource already exists', message = null) => 
  errorResponse(res, 409, error, message);

const serverError = (res, error = 'Internal server error', message = null) => 
  errorResponse(res, 500, error, message);

module.exports = {
  successResponse,
  errorResponse,
  created,
  ok,
  deleted,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  serverError
};
