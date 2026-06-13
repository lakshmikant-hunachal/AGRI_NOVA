const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'agrinova_jwt_secret_key_2026';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, we can allow queries for compatibility with the mock frontend, 
  // but let's check for validation. To be secure, we verify the token if present.
  if (!token) {
    // For legacy/simple calls from frontend without token, we check query/body email
    const email = req.query.email || (req.body && req.body.userEmail);
    if (email) {
      req.user = { email };
      return next();
    }
    return res.status(401).json({ error: 'Access denied. Token or Email identity is required.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = {
  authenticateToken,
  JWT_SECRET
};
