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

module.exports = authenticateToken;
