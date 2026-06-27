const jwt = require('jsonwebtoken');

/**
 * Middleware that protects routes requiring a logged-in user.
 *
 * How it works:
 * 1. The client sends every request with an Authorization header:
 *      Authorization: Bearer <token>
 * 2. This middleware pulls out the token, verifies it against JWT_SECRET,
 *    and attaches the decoded user payload to req.user.
 * 3. If the token is missing or invalid, the request is rejected with 401.
 *
 * Any route that needs authentication just uses:
 *    router.get('/something', protect, yourController)
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info so controllers can use req.user.id
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token is invalid or expired' });
  }
};

module.exports = { protect };
