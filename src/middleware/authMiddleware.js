const jwt = require('jsonwebtoken');

// List of logged-out tokens stored in server memory
let blacklist = [];

// Verify JWT Token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided.' });
  }

  // Validate the logged-out tokens
  if (blacklist.includes(token)) {
    return res.status(401).json({ error: 'Token is invalidated.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ error: 'Unauthorized access.' });
  }
};

// Invalidate Token (Call when user logs out)
exports.invalidateToken = (token) => {
  blacklist.push(token);
};