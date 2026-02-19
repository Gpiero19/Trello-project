const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
const { unauthorized } = require('./responseFormatter');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) return unauthorized(res, 'Unauthorized', 'No token provided');

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // decoded has user information
    next();

  } catch (err) {
    return unauthorized(res, 'Invalid token', 'Token is invalid or expired');
  }
};

// Optional authentication - continues even without token, but extracts user if available
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    // No token, continue without user
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    // Invalid token, continue without user (don't block the request)
    req.user = null;
  }
  next();
};

// Export both - use named export for optionalAuth and default for backwards compatibility
module.exports = authenticateToken;
module.exports.authenticateToken = authenticateToken;
module.exports.optionalAuth = optionalAuth;
